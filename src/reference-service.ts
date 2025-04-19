import * as vscode from 'vscode';
import { SymbolKindWarp, JavaReference } from './models';
import { getClassName, getPackageName } from './utils';

export async function getReferenceAtPosition(document: vscode.TextDocument, position: vscode.Position, word: string): Promise<JavaReference | null> {
    try {
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
            'vscode.executeDocumentSymbolProvider',
            document.uri
        );

        // 查找光标位置的符号
        if (symbols && symbols.length > 0) {
            return buildReferenceFromSymbol(symbols, document, word);
        }
    } catch (error) {
        console.error('Error getting document symbols:', error);
    }
    
    return null;
}

export function buildReferenceFromSymbol(symbols: vscode.DocumentSymbol[], document: vscode.TextDocument, word: string): JavaReference | null {
    try {
        const packageName = getPackageName(symbols, document);
        const className = getClassName(symbols, document);
        const warp = findSymbolByName(symbols, word);
        
        return {
            packageName: packageName,
            className: className,
            type: warp.kind,
            currentName: warp.name,
            importText: `import ${packageName}.${className};`,
            clipboardText: getlipboardText(packageName, className, warp),
            insertText: getInsertText(packageName, className, warp)
        }
    } catch (err) {
        console.error(err);
        return null;
    }
} 

/**
 * 递归查找在符号树中名称匹配指定单词的符号
 * @param symbols 符号数组
 * @param word 要查找的单词
 * @returns 匹配的符号或null
 */
function findSymbolByName(symbols: vscode.DocumentSymbol[], word: string): SymbolKindWarp {
    for (const symbol of symbols) {
        // 检查当前符号是否匹配
        let methodOrther = symbol.name;
        if (methodOrther.indexOf('(') > -1) { 
            methodOrther = methodOrther.substring(0, methodOrther.indexOf('('));
        }
        if (methodOrther === word) {
            return {
                kind: symbol.kind,
                name: symbol.name
            };
        }
        
        // 递归检查子符号
        if (symbol.children && symbol.children.length > 0) {
            const childMatch = findSymbolByName(symbol.children, word);
            if (childMatch) {
                return childMatch;
            }
        }
    }
    
    throw new Error('No symbol found');
}

function getlipboardText(packageName: string, className: string, warp: SymbolKindWarp): string {
    const type = warp.kind;
    let array = [packageName, className];

    if (type === vscode.SymbolKind.Class
         || type === vscode.SymbolKind.Interface 
         || type === vscode.SymbolKind.Enum) {
        // 如果是一个类， 接口， 枚举，则不需要添加后缀
        return array.join(".");
    } else if (type === vscode.SymbolKind.Method) {
        // 如果是一个方法，则添加()
        return array.join(".") + '.' +warp.name;
    } else{
        // 其他需要添加成员名称
        array.push(warp.name);
        return array.join(".");
    }
      
}

function getInsertText(packageName: string, className: string, warp: SymbolKindWarp): string {
    const type = warp.kind;
    let array = [className];

    if (type === vscode.SymbolKind.Class
         || type === vscode.SymbolKind.Interface 
         || type === vscode.SymbolKind.Enum) {
        // 如果是一个类， 接口， 枚举，则不需要添加后缀
        return array.join(".");
    } else if (type === vscode.SymbolKind.Method) {
        // 如果是一个方法，则添加()
        return array.join(".") + '.' + warp.name.substring(0, warp.name.indexOf('(')) + '();';
    } else{
        // 其他需要添加成员名称
        array.push(warp.name);
        return array.join(".");
    }
}