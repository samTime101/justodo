import * as vscode from 'vscode';


export async function initializeJsonifNotExists(todosFolderUri: vscode.Uri) {
    const jsonUri = vscode.Uri.joinPath(todosFolderUri, 'todos.json');

    try {
        await vscode.workspace.fs.stat(jsonUri);
    } catch {
        const initialContent = new TextEncoder().encode(JSON.stringify({ todos: [] }, null, 4));
        await vscode.workspace.fs.writeFile(jsonUri, initialContent);
    }
}