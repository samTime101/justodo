# Todos — VS Code Extension

Lightweight VS Code extension that adds human-readable IDs (HUIDs) to TODO
comments and keeps them synced in a workspace-local JSON store.

## Demo
https://github.com/user-attachments/assets/48cd71eb-67cb-418f-87d5-c9cad5a2e6c9

## Features
- Add a unique HUID to the TODO on the current line and record it in `.todos/todos.json`.
- Mark a TODO as done; the line is removed and the JSON store is updated.
- Language-aware comment symbols for 30+ languages (JS/TS, Python, Go, Rust, HTML, CSS, etc.).
- Workspace-scoped storage so each project keeps its own TODO log.

## Requirements
- VS Code `^1.106.1`
- Node.js 18+ recommended for tooling (build/test)

## Installation
https://github.com/user-attachments/assets/979c4d01-df12-440b-8808-5823dd2c3505

## Usage
1) Write a TODO comment on any line, e.g. `// TODO: handle empty state`.
2) Run `todos.createTodo` (or press `Ctrl+Shift+6`). The line becomes
   `// TODO<YYYYMMDD-HHMMSS>: handle empty state`.
3) To complete it, place the cursor on that line and run `todos.markTodo`
   (or `Ctrl+Shift+7`). The line is removed and the entry is marked done.

## Storage
- A `.todos` folder is created at the workspace root with `todos.json`.
- Entries are grouped by file path and HUID:
  ```json
  {
      "todos": [
          {
              "path/to/file.ts": {
                  "20251208-161530": {
                      "heading": "handle empty state",
                      "done": false,
                      "createdAt": "2025-12-08T16:15:30.000Z",
                      "modifiedAt": null
                  }
              }
          }
      ]
  }
  ```

## Development
- Install deps: `npm install`
- Build once: `npm run compile`
- Watch: `npm run watch`
- Lint: `npm run lint`
- Type-check: `npm run check-types`
- Tests (sample): `npm test`
- Package for release: `npm run package` (outputs to `dist/`)

To debug, run the “Extension” launch configuration (F5). This opens a new
VS Code window with the extension loaded.

## Inspiration
Inspired by Tsoding’s HUID-style TODO workflow:
[Watch on YouTube](https://www.youtube.com/watch?v=QH6KOEVnSZA&t=3411s)

## Author
Samip Regmi ([samTime101](https://github.com/samTime101))
