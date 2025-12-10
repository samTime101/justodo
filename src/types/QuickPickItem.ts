import * as vscode from 'vscode';
export interface TodoQuickPickItem extends vscode.QuickPickItem {
    line: number;
}
