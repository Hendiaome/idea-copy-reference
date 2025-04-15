import * as vscode from 'vscode';

export interface JavaReference {
    packageName?: string;

    className: string;   

    currentName?: string;

    type?: vscode.SymbolKind;

    importText?: string;

    insertText?: string;

    clipboardText?: string;

} 

export interface SymbolKindWarp {
    kind: vscode.SymbolKind;

    name: string;  
}