// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { JavaReference } from './models';
import { addImportStatement } from './utils';
import { getReferenceAtPosition } from './reference-service';

// 存储最近复制的引用
let lastCopiedReference: JavaReference | null = null;

export function activate(context: vscode.ExtensionContext) {
    // 注册复制引用命令
    const copyDisposable = vscode.commands.registerCommand('idea-copy-reference.copyJavaReference', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'java') {
                vscode.window.showInformationMessage('Please open a Java file and select a reference.');
                return;
            }

            const position = editor.selection.active;
            const document = editor.document;
            
            // 获取当前光标位置的单词
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                vscode.window.showInformationMessage('No valid Java reference found at cursor.');
                return;
            }
            const word = document.getText(wordRange);
            
            // 获取引用信息
            const reference = await getReferenceAtPosition(document, position, word);
            if (!reference) {
                vscode.window.showInformationMessage('No valid Java reference found at cursor.');
                return;
            }
            
            // 存储引用信息以供粘贴时使用
            lastCopiedReference = reference;
            
            // 复制到剪贴板 
            await vscode.env.clipboard.writeText(reference.clipboardText || '');
            vscode.window.showInformationMessage(`Reference copied: ${reference.clipboardText}`);
        } catch (err) {
            console.error(err);
            vscode.window.showErrorMessage(`Failed to copy reference: ${err}`);
        }
    });

    // 注册自定义粘贴命令 - 通过菜单触发
    const pasteDisposable = vscode.commands.registerCommand('idea-copy-reference.pasteJavaReference', async () => {
        try {
            // 检查是否有活动的编辑器和复制的引用
            const editor = vscode.window.activeTextEditor;
            
            // 如果没有复制过Java引用，或不在Java文件中
            if (!editor || !lastCopiedReference || editor.document.languageId !== 'java') {
                vscode.window.showInformationMessage('No Java reference has been copied or not in a Java file.');
                return;
            }

            if (lastCopiedReference.insertText && lastCopiedReference.importText) {
                // 添加导入语句
                await addImportStatement(editor, lastCopiedReference.importText);
                
                // 插入简化的引用文本到当前光标位置
                const position = editor.selection.active;
                await editor.edit(editBuilder => {
                    editBuilder.insert(position, lastCopiedReference!.insertText || '');
                });
                
                vscode.window.setStatusBarMessage(`Reference inserted with import added`, 3000);
            } else {
                vscode.window.showInformationMessage('Invalid Java reference data.');
            }
        } catch (err) {
            console.error('Error during paste operation:', err);
            vscode.window.showErrorMessage(`Failed to paste reference: ${err}`);
        }
    });

    context.subscriptions.push(copyDisposable, pasteDisposable);
}

export function deactivate() {}