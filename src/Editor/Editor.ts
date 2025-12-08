/**
 * @file Editor.ts
 * @description Provides utilities for interacting with the active VS Code editor,
 * including reading and updating lines, parsing TODO comments, and retrieving
 * editor and file information.
 * 
 * The class supports:
 * - Getting the current line and its text.
 * - Parsing TODOs with optional UIDs.
 * - Updating or removing TODO lines.
 * - Retrieving the current file path.
 * 
 * @author Samip Regmi (samTime101)
 * @license MIT
 * @since 1.0.0
 */

import * as vscode from 'vscode';
import { ParsedTodo } from '../types/ParsedTodo';
import { getCommentSymbol } from '../utils/getLanguageSymbol';

/**
 * Represents a VS Code editor and provides methods to interact with
 * the text, TODOs, and selection within the editor.
 * 
 * @since 1.0.0
 */
export class Editor {
    /**
     * The active VS Code text editor instance.
     */
    editor: vscode.TextEditor;

    /**
     * Creates a new Editor instance.
     * 
     * @param {vscode.TextEditor} editor - The active text editor.
     * @since 1.0.0
     */
    public constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    /**
     * Returns the current line number where the cursor is located.
     * 
     * @returns {number} The active line number.
     * @since 1.0.0
     */
    public getCurrentLine(): number {
        return this.editor.selection.active.line;
    }

    /**
     * Retrieves the text content of a specific line in the editor.
     * 
     * @param {number} line - The line number to retrieve.
     * @returns {string} The text of the specified line.
     * @since 1.0.0
     */
    public getLineText(line: number): string {
        return this.editor.document.lineAt(line).text;
    }

    /**
     * Parses a TODO comment at a specific line and returns its details.
     * Supports optional UID in the format `<YYYYMMDD-HHMMSS>`.
     * 
     * @param {number} line - The line number to parse.
     * @returns {ParsedTodo | null} Parsed TODO information, or null if no TODO is found.
     * @since 1.0.0
     */
    public parseTodoAtLine(line: number): ParsedTodo | null {
        const languageId = this.editor.document.languageId;
        const commentSymbol = getCommentSymbol(languageId);
        const lineText = this.getLineText(line);
        const regex = new RegExp(`^\\s*${commentSymbol}\\s*TODO(?:<([0-9]{8}-[0-9]{6})>)?:\\s*(.+)$`);
        const match = lineText.match(regex);

        if (!match) {
            return null;
        }
        const uid = match[1];
        const heading = match[2];
        return {
            heading: heading.trim(),
            hasUID: Boolean(uid),
            existingUID: uid
        };
    }

    /**
     * Updates the text of a specific line in the editor.
     * 
     * This method replaces the content of the given line with the provided `newText`.
     * The edit is asynchronous and returns a Thenable indicating whether it succeeded.
     * 
     * @param {number} line - The line number to update.
     * @param {string} newText - The new text to replace the line with.
     * @returns {Thenable<boolean>} Resolves to `true` if the edit was applied successfully, `false` otherwise.
     * @since 1.0.0
     */
    public updateTodoLine(line: number, newText: string): Thenable<boolean> {
        const lineRange = this.editor.document.lineAt(line).range;
        return this.editor.edit(editBuilder => {
            editBuilder.replace(lineRange, newText);
        });
    }

    /**
     * Removes a specific line from the editor.
     * 
     * This method deletes the entire line, including the line break.
     * The edit is asynchronous and returns a Thenable indicating whether it succeeded.
     * 
     * @param {number} line - The line number to remove.
     * @returns {Thenable<boolean>} Resolves to `true` if the line was deleted successfully, `false` otherwise.
     * @since 1.0.0
     */
    public removeTodoLine(line: number): Thenable<boolean> {
        const lineRange = this.editor.document.lineAt(line).rangeIncludingLineBreak;
        return this.editor.edit(editBuilder => {
            editBuilder.delete(lineRange);
        });
    }

    /**
     * Retrieves the file system path of the current document in the editor.
     * 
     * @returns {string} The file path of the current document.
     * @since 1.0.0
     */
    public getCurrentFilePath(): string {
        return this.editor.document.uri.fsPath;
    }
}
