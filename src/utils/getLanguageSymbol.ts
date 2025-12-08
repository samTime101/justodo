/**
 * Returns the comment symbol for a given programming language.
 *
 * This is useful for generating TODO comments in the correct format
 * depending on the file type.
 *
 * @param {string} languageId - The VS Code language ID (e.g., 'javascript', 'python', 'html').
 * @returns {string} The string used for single-line comments in that language.
 *                   Defaults to '//' if the language is unknown.
 *
 * @example
 * getCommentSymbol('javascript'); // returns '//'
 * getCommentSymbol('python'); // returns '#'
 * getCommentSymbol('html'); // returns '<!--'
 *
 * @since 1.0.0
 */
export function getCommentSymbol(languageId: string): string {
    const commentMap: { [key: string]: string } = {
        'javascript': '//',
        'typescript': '//',
        'python': '#',
        'java': '//',
        'c': '//',
        'cpp': '//',
        'csharp': '//',
        'go': '//',
        'rust': '//',
        'php': '//',
        'ruby': '#',
        'swift': '//',
        'kotlin': '//',
        'dart': '//',
        'html': '<!--',
        'css': '/*',
        'scss': '//',
        'less': '//',
        'yaml': '#',
        'toml': '#',
        'json': '//',
        'jsonc': '//',
        'xml': '<!--',
        'markdown': '<!--',
        'shellscript': '#',
        'powershell': '#',
        'bat': 'REM',
        'sql': '--',
        'lua': '--',
        'perl': '#',
        'r': '#',
        'vue': '//',
        'svelte': '//',
        'coffeescript': '#',
        'dockerfile': '#',
        'makefile': '#',
        'ini': ';',
    };

    return commentMap[languageId] || '//';
}