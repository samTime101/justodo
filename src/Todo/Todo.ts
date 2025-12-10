/**
 * @file Todo.ts
 * @description Handles reading, writing, and updating TODO items in a JSON file.
 * Provides methods to add new TODOs, mark them as done, and check existence.
 * 
 * @author Samip Regmi (samTime101)
 * @license MIT
 * @since 1.0.0
 */

import * as vscode from 'vscode';
import { TodoItem } from '../types/TodoItem';
import { TodoQuickPickItem } from '../types/QuickPickItem';

/**
 * Handles reading, writing, and updating TODO items in a JSON file.
 * Provides methods to add new TODOs, mark them as done, and check existence.
 * 
 * @example
 * const todoManager = new Todo(todoJsonUri);
 * await todoManager.addTodo({
 *   huid: '20251208-123456',
 *   heading: 'Implement feature X',
 *   filePath: 'src/index.ts',
 *   line: 10,
 *   done: false,
 *   createdAt: new Date().toISOString()
 * });
 * 
 * @since 1.0.0
 */
export class Todo {
    /**
     * The URI of the `todos.json` file where TODOs are stored.
     */
    private readonly todoJsonUri: vscode.Uri;

    /**
     * Creates a new Todo instance.
     * 
     * @param {vscode.Uri} todoJsonUri - URI of the `todos.json` file.
     * @since 1.0.0
     */
    public constructor(todoJsonUri: vscode.Uri) {
        this.todoJsonUri = todoJsonUri;
    }

    /**
     * Reads the content of the `todos.json` file and parses it into an object.
     * 
     * @async
     * @returns {Promise<any>} The parsed JSON object from the file.
     * @throws Will throw if the file cannot be read or parsed.
     * @since 1.0.0
     */
    private async readJson(): Promise<any> {
        const fileData = await vscode.workspace.fs.readFile(this.todoJsonUri);
        const fileContent = Buffer.from(fileData).toString('utf8');
        return JSON.parse(fileContent);
    }

    /**
     * Writes the provided JSON object to the `todos.json` file.
     * 
     * @async
     * @param {any} todosJson - The JSON object to write.
     * @returns {Promise<void>}
     * @throws Will throw if writing to the file fails.
     * @since 1.0.0
     */
    private async writeJson(todosJson: any): Promise<void> {
        const updatedContent = new TextEncoder().encode(JSON.stringify(todosJson, null, 4));
        await vscode.workspace.fs.writeFile(this.todoJsonUri, updatedContent);
    }

    /**
     * Adds a new TODO item to the JSON file.
     * 
     * @async
     * @param {TodoItem} todo_data - The TODO item to add.
     * @returns {Promise<void>}
     * @since 1.0.0
     */
    public async addTodo(todo_data: TodoItem): Promise<void> {
        const { huid, heading, filePath, line, done, createdAt } = todo_data;
        try {
            const todosJson = await this.readJson();
            if (!todosJson.todos) {
                todosJson.todos = [];
            }

            const todo_to_add = {
                [filePath]: {
                    [huid]: {
                        heading,
                        done,
                        line,
                        createdAt,
                        markedAt: null
                    }
                }
            };

            todosJson.todos.push(todo_to_add);
            await this.writeJson(todosJson);
        } catch (error) {
            vscode.window.showErrorMessage(`Error writing TODO to JSON: ${error}`);
        }
    }

    /**
     * Marks an existing TODO item as done and updates the modified timestamp.
     * 
     * @async
     * @param {string} filePath - Path of the file containing the TODO.
     * @param {string} huid - Unique ID of the TODO item.
     * @returns {Promise<void>}
     * @since 1.0.0
     */
    public async markTodoAsDone(filePath: string, huid: string): Promise<void> {
        try {
            const todosJson = await this.readJson();
            for (const todoEntry of todosJson.todos) {
                if (todoEntry[filePath] && todoEntry[filePath][huid]) {
                    todoEntry[filePath][huid].done = true;
                    todoEntry[filePath][huid].modifiedAt = new Date().toISOString();
                    break;
                }
            }
            await this.writeJson(todosJson);
        } catch (error) {
            vscode.window.showErrorMessage(`Error marking TODO as done: ${error}`);
        }
    }

    /**
     * Checks if the `todos.json` file exists.
     * 
     * @async
     * @returns {Promise<boolean>} True if the file exists, false otherwise.
     * @since 1.0.0
     */
    public async JsonFileexists(): Promise<boolean> {
        try {
            await vscode.workspace.fs.stat(this.todoJsonUri);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks if a TODO with a specific `huid` exists for a given file.
     * 
     * @async
     * @param {string} filePath - Path of the file to check.
     * @param {string} huid - Unique ID of the TODO item.
     * @returns {Promise<boolean>} True if the TODO exists, false otherwise.
     * @since 1.0.0
     */
    public async HuidExists(filePath: string, huid: string): Promise<boolean> {
        try {
            const todosJson = await this.readJson();
            for (const todoEntry of todosJson.todos) {
                if (todoEntry[filePath] && todoEntry[filePath][huid]) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Retrieves all TODO items for a specific file.
     * 
     * @async
     * @param {vscode.Uri} currentFilePath - The URI of the file to retrieve TODOs from.
     * @returns {Promise<TodoItem[]>} An array of TODO items found in the file. Returns an empty array if no TODOs are found or on error.
     * @since 1.0.2
     */

    public async getTodosInFile(currentFilePath: vscode.Uri): Promise<TodoItem[]> {
        try {
            const todosJson = await this.readJson();
            const todosInFile: TodoItem[] = [];
            const filePathStr = currentFilePath.fsPath;

            for (const todoEntry of todosJson.todos) {
                const fileTodos = todoEntry[filePathStr];
                if (fileTodos) {
                    for (const huid in fileTodos) {
                        const todoData = fileTodos[huid];
                        todosInFile.push({
                            huid,
                            heading: todoData.heading,
                            filePath: filePathStr,
                            line: todoData.line - 1,
                            done: Boolean(todoData.done),
                            createdAt: new Date(todoData.createdAt),
                            markedAt: todoData.markedAt ? new Date(todoData.markedAt) : undefined
                        });
                    }
                }
            }

            return todosInFile;
        } catch (err) {
            console.error('Failed to get todos in file:', err);
            return [];
        }
    }
    /**
     * Converts an array of TODO items into VS Code QuickPick items for selection in the UI.
     * 
     * @async
     * @param {vscode.Uri} currentFilePath - The URI of the file containing TODOs.
     * @param {TodoItem[]} todosInFile - Array of TODO items to convert into QuickPick items.
     * @returns {Promise<TodoQuickPickItem[]>} An array of QuickPick items representing the TODOs.
     * @since 1.0.2
     * 
     * @example
     * const todosInFile = await todoManager.getTodosInFile(fileUri);
     * const quickPickItems = await todoManager.getTodosQuickPickItems(fileUri, todosInFile);
     * vscode.window.showQuickPick(quickPickItems);
     */
    public async getTodosQuickPickItems(currentFilePath: vscode.Uri, todosInFile: TodoItem[]): Promise<TodoQuickPickItem[]> {
        if (todosInFile.length === 0) {
            vscode.window.showInformationMessage(`No TODOs found in ${currentFilePath}.`);
            return [];
        }

        const quickPickItems = todosInFile.map((todo) => {
            return {
                label: `$(${todo.done ? 'check' : 'circle-outline'}) ${todo.heading}`,
                description: `HUID: ${todo.huid}`,
                detail: todo.done
                    ? `Marked At: ${todo.markedAt ? todo.markedAt.toLocaleString() : todo.createdAt.toLocaleString()}\n\nLine: ${todo.line + 1}`
                    : `Created At: ${todo.createdAt.toLocaleString()}`,
                line: todo.line
            };
        }
        );
        return quickPickItems;
    }
}