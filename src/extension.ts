import * as vscode from 'vscode';

import { TodoManager } from './Main';

export function activate(context: vscode.ExtensionContext) {

	const createTodoDisposable = vscode.commands.registerCommand('todos.createTodo', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { 
			return;
		}

		const todoManager = new TodoManager(editor);
		todoManager.createTodo();
	});
	const markTodoDoneDisposable = vscode.commands.registerCommand('todos.markTodo', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { 
			return;
		}
		const todoManager = new TodoManager(editor);
		todoManager.markTodoDone();
	});

	const searchTodosCurrentDisposable = vscode.commands.registerCommand('todos.searchTodos', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { 
			return;
		}
		const todoManager = new TodoManager(editor);
		todoManager.searchTodosFile();
	});

	context.subscriptions.push(searchTodosCurrentDisposable);
	context.subscriptions.push(markTodoDoneDisposable);
	context.subscriptions.push(createTodoDisposable);
}
export function deactivate() { }
