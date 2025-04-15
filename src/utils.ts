import * as vscode from 'vscode';
import { JavaReference } from './models';


export function getPackageName(symbols: vscode.DocumentSymbol[], document: vscode.TextDocument): string {
    for (const symbol of symbols) {
        if (symbol.kind === vscode.SymbolKind.Package) {
            return symbol.name;
        }
    }
    
    throw new Error('No package found');
}

export function getClassName(symbols: vscode.DocumentSymbol[], document: vscode.TextDocument): string {
    for (const symbol of symbols) {
        if (symbol.kind === vscode.SymbolKind.Class 
            || symbol.kind === vscode.SymbolKind.Interface
            || symbol.kind === vscode.SymbolKind.Enum) {
            return symbol.name;
        }
    }


   throw new Error('No class found');
}

export async function addImportStatement(editor: vscode.TextEditor, importStatement: string): Promise<void> {
    const document = editor.document;
    const text = document.getText();
    
    // Don't add if import already exists
    if (text.includes(importStatement)) {
        return;
    }
    
    // Find the position to insert import
    let insertPosition: vscode.Position;
    const lines = text.split('\n');
    
    // Find the last import statement and first class declaration
    let lastImportLine = -1;
    let packageLine = -1;
    let classLine = -1;

    // 只需要检查到第一个类声明为止
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('import ')) {
            lastImportLine = i;
        } else if (line.startsWith('package ')) {
            packageLine = i;
        } else if (line.match(/^(public\s+|private\s+|protected\s+)?(abstract\s+|final\s+)?(class|interface|enum)\s+/)) {
            // 找到类、接口或枚举声明，记录行号并停止搜索
            classLine = i;
            break;
        }
    }
    
    if (lastImportLine !== -1) {
        // Insert after the last import
        insertPosition = new vscode.Position(lastImportLine + 1, 0);
    } else if (packageLine !== -1) {
        // Insert after package
        insertPosition = new vscode.Position(packageLine + 1, 0);
    } else if (classLine !== -1) {
        // Insert before class declaration
        insertPosition = new vscode.Position(classLine, 0);
    } else {
        // Insert at the beginning of the file
        insertPosition = new vscode.Position(0, 0);
    }
    
    // Insert the import statement
    await editor.edit(editBuilder => {
        editBuilder.insert(insertPosition, importStatement + '\n');
    });
} 