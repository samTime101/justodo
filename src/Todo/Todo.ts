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
                        createdAt,
                        modifiedAt: null
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
}