import * as vscode from 'vscode';
import { parseTodoLine } from './TodoParser';
import { generateHUID } from '../utils/huid';
import { ParsedTodo } from '../types/ParsedTodo';
import { findGitRepo } from './findGitRepo';
import { ensureTodosFolder } from './TodosFolder';
import { updateTodoLine } from './updateTodoLine';
import { initializeGitifNotExists } from './initializeGitifNotExists';
import { initializeJsonifNotExists } from './initializeJsonifNotExists';

export async function processTodoLine(editor: vscode.TextEditor) {
    /*
     *  Arguments:
     *    editor: The active text editor where the TODO line is located.
     *  Returns:
     *   void 
     */
    const doc = editor.document;
    const lineNum = editor.selection.active.line;
    const lineText = doc.lineAt(lineNum).text;

    const parsed: ParsedTodo | null = parseTodoLine(lineText, doc.languageId);

    if (!parsed) {
        vscode.window.showErrorMessage("No TODO found on this line!");
        return;
    }
    
    const { heading, hasUID, existingUID } = parsed;
    if (hasUID) {
        vscode.window.showInformationMessage(`TODO already has HUID: ${existingUID}`);
        return;
    }
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
    const repo = await findGitRepo(workspaceFolder);
    await initializeGitifNotExists(repo);
    const todosFolderUri = await ensureTodosFolder(repo);
    const huid = generateHUID();
    await updateTodoLine(editor, huid, heading, doc.languageId);
    await initializeJsonifNotExists(todosFolderUri);
}