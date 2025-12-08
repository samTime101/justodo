import * as vscode from 'vscode';


export async function writeTodoinJson(todosFolderUri: vscode.Uri, todo: { huid: string; heading: string; file: string; line: number; }) {
    /**
     * {
     *   "todos": [
     *   {
     *      "folder/1.py":[
     *      "linenumber": {
     *          "huid": "heading",
     *          "done": false,
     *      "createdAt": "2024-10-10T10:10:10.000Z"
     *      },
     *      "linenumber": {
     *          "huid": "heading",
     *         "done": false,
     *        "createdAt": "2024-10-10T10:10:10.000Z"
     *      }
     * ],
     *  "folder/2.py":[
     *      "linenumber": {
     *          "huid": "heading",
     *          "done": false,
     *      "createdAt": "2024-10-10T10:10:10.000Z"
     *      }
     * }
     * ]
     * 
     * }
     * 
     * 
     * 
     */

}