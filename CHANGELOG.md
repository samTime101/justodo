# Change Log

All notable changes to the "todos" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.2] - 2025-12-10

### Added
- Added `todos.searchTodos` command (Ctrl+Shift+8) to list TODOs in the current file and jump to the selected line via Quick Pick.
- Added helpers to gather TODOs per file and format them as Quick Pick items with status, timestamps, and line info.

## [1.0.1] - 2025-12-08

### Added
- Added Extension versioning in `package.json` to `1.0.1`.
- Added Image icon for the extension in `package.json`.

## [1.0.0] - 2025-12-08

## Added
- Added `TodoItem` type definition with `huid`, `heading`, `filePath`, `line`, `done`, `createdAt`, and `modifiedAt` fields.
- Added `TodoManager` class in `src/Main.ts` to manage TODO creation and marking as done.
- Added `Editor` class in `src/Editor/Editor.ts` for editor interactions (line parsing, updating, removing).
- Added `Workspace` class in `src/workspace/Workspace.ts` for workspace folder and `.todos` folder management.
- Added `Todo` class in `src/Todo/Todo.ts` for JSON file operations (read, write, add, update TODO items).
- Added `getGeneratedHUID()` function to `src/utils/getGeneratedHUID.ts` to generate unique timestamps.
- Added `getCommentSymbol()` function to `src/utils/getLanguageSymbol.ts` to support 30+ programming languages.
- Added `markTodo` command (Ctrl+Shift+7) to mark TODOs as done.

## Changed
- Refactored extension.ts to use `TodoManager` class instead of direct function calls.
- Updated keybinding for `createTodo` from Ctrl+Shift+8 to Ctrl+Shift+6.
- Updated `README.md` with extension details.
- Updated test file to import workspace, todo, and editor classes.
- Updated `package.json` with publisher and author information.
- Replaced `id` field with `huid` in `TodoItem` interface.

## Removed
- Removed old `TodoProcessor.ts` and `TodoParser.ts` files (functionality integrated into `TodoManager` and `Editor`).
- Removed separate utility files: `findGitRepo.ts`, `initializeGitifNotExists.ts`, `initializeJsonifNotExists.ts`, `updateTodoLine.ts`, `writeTodoinJson.ts`.
- Removed old `language.ts` file (replaced with `getLanguageSymbol.ts`).
- Removed old `huid.ts` file (replaced with `getGeneratedHUID.ts`).

## Fixed
- Fixed `getCommentSymbol()` function to properly map language IDs to comment symbols instead of just returning `#`.