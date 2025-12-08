/**
 * @file Main.ts
 * @description Handles creating and marking TODOs as done in VS Code editor.
 * Provides utility functions to add unique HUIDs to TODOs and update the JSON store.
 * 
 * @author Samip Regmi (samTime101)
 * @license MIT
 * @since 1.0.0
 * 
 * Copyright (c) 2025 Samip Regmi
 */

import { Workspace } from "./workspace/Workspace";
import { Todo } from "./Todo/Todo";
import { Editor } from "./Editor/Editor";
import * as vscode from "vscode";
import { getCommentSymbol } from "./utils/getLanguageSymbol";
import { getGeneratedHUID } from "./utils/getGeneratedHUID";

/**
 * Manages TODO operations for a single editor.
 */
export class TodoManager {
    private editor: vscode.TextEditor;
    private workspace!: Workspace;
    private editorWrapper!: Editor;
    private todo!: Todo;

    /**
     * @param {vscode.TextEditor} editor - The active VS Code editor.
     */
    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    /**
     * Initializes Workspace, Editor wrapper, and Todo JSON handler.
     */
    public async init(): Promise<void> {
        this.workspace = new Workspace(this.editor);
        this.editorWrapper = new Editor(this.editor);
        const todosJsonFileUri = await this.workspace.getTodosJsonUri();
        this.todo = new Todo(todosJsonFileUri);
    }

    /**
     * Creates a new TODO on the current line.
     * Adds a unique HUID if it doesn't already exist.
     */
    public async createTodo(): Promise<void> {
        await this.init();
        const currentLine = this.editorWrapper.getCurrentLine();
        const currentFilePath = this.editorWrapper.getCurrentFilePath();
        const parsedTodo = this.editorWrapper.parseTodoAtLine(currentLine);

        if (!parsedTodo) {
            vscode.window.showErrorMessage("No TODO found on the current line.");
            return;
        }

        const { heading, hasUID, existingUID } = parsedTodo;

        if (hasUID) {
            vscode.window.showInformationMessage(`TODO already has HUID: ${existingUID}`);
            return;
        }

        const huid = getGeneratedHUID();
        const languageId = this.editor.document.languageId;
        const newLine = `${getCommentSymbol(languageId)} TODO<${huid}>: ${heading}`;

        const lineUpdated = await this.editorWrapper.updateTodoLine(currentLine, newLine);
        if (!lineUpdated) {
            vscode.window.showErrorMessage("Failed to update the TODO line.");
            return;
        }

        vscode.window.showInformationMessage(`Added HUID: ${huid} to the TODO.`);

        await this.todo.addTodo({
            huid,
            heading,
            filePath: currentFilePath,
            line: currentLine,
            done: false,
            createdAt: new Date(),
        });
    }

    /**
     * Marks the TODO on the current line as done.
     * Removes it from the editor and updates the JSON store.
     */
    public async markTodoDone(): Promise<void> {
        await this.init();
        const currentLine = this.editorWrapper.getCurrentLine();
        const currentFilePath = this.editorWrapper.getCurrentFilePath();
        const parsedTodo = this.editorWrapper.parseTodoAtLine(currentLine);

        if (!parsedTodo) {
            vscode.window.showErrorMessage("No TODO found on the current line.");
            return;
        }

        const { hasUID, existingUID } = parsedTodo;

        if (!hasUID) {
            vscode.window.showErrorMessage("This TODO does not have a HUID.");
            return;
        }
        const exists = await this.todo.HuidExists(currentFilePath, existingUID!);
        if (!exists) {
            vscode.window.showErrorMessage(`No TODO found with HUID: ${existingUID}`);
            return;
        }
        await this.editorWrapper.removeTodoLine(currentLine);
        await this.todo.markTodoAsDone(currentFilePath, existingUID!);

        vscode.window.showInformationMessage(`Marked TODO with HUID: ${existingUID} as done.`);
    }
}
