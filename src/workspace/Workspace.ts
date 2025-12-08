/**
 * @file Workspace.ts
 * @description Handles workspace-related operations for managing TODOs,
 * including retrieving the workspace folder and managing the `.todos` folder
 * and `todos.json` file.
 * 
 * @author Samip Regmi (samTime101)
 * @license MIT
 * @since 1.0.0
 */

import * as vscode from 'vscode';

/**
 * Represents a VS Code workspace and provides utility methods
 * for managing TODOs within the workspace.
 * 
 * @example
 * const workspace = new Workspace(editor);
 * const todosJsonUri = await workspace.getTodosJsonUri();
 * 
 * @since 1.0.0
 */
export class Workspace {

    /**
     * The active text editor in VS Code.
     */
    private readonly editor: vscode.TextEditor;

    /**
     * Creates a new Workspace instance.
     * 
     * @param {vscode.TextEditor} editor - The active text editor.
     * @since 1.0.0
     */
    public constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    /**
     * Gets the workspace folder that contains the current editor's document.
     * Returns `null` if no workspace folder is found.
     * 
     * @type {vscode.WorkspaceFolder | null}
     * @readonly
     * @since 1.0.0
     */
    get Workspacefolder(): vscode.WorkspaceFolder | null {
        return vscode.workspace.getWorkspaceFolder(this.editor.document.uri) || null;
    }

    /**
     * Ensures that the `.todos` folder exists in the current workspace folder.
     * Creates the folder if it doesn't exist.
     * 
     * @async
     * @returns {Promise<vscode.Uri>} The URI of the `.todos` folder.
     * @throws {Error} If the workspace folder cannot be found.
     * @since 1.0.0
     */
    async getTodosFolder(): Promise<vscode.Uri> {
        if (!this.Workspacefolder) {
            throw new Error("No workspace folder found.");
        }
        const uri = vscode.Uri.joinPath(this.Workspacefolder.uri, '.todos');
        try {
            await vscode.workspace.fs.stat(uri);
        } catch {
            await vscode.workspace.fs.createDirectory(uri);
        }
        return uri;
    }

    /**
     * Ensures that the `todos.json` file exists in the `.todos` folder.
     * Creates the file with an empty `todos` array if it doesn't exist.
     * 
     * @async
     * @returns {Promise<vscode.Uri>} The URI of the `todos.json` file.
     * @since 1.0.0
     */
    async getTodosJsonUri(): Promise<vscode.Uri> {
        const folder = await this.getTodosFolder();
        const jsonUri = vscode.Uri.joinPath(folder, 'todos.json');
        try {
            await vscode.workspace.fs.stat(jsonUri);
        } catch {
            const content = JSON.stringify({ todos: [] }, null, 4);
            const encodedContent = new TextEncoder().encode(content);
            await vscode.workspace.fs.writeFile(jsonUri, encodedContent);
        }
        return jsonUri;
    }
}
