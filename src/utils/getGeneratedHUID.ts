/**
 * Generates a unique HUID (Human-Readable Unique ID) based on the current date and time.
 *
 * The format of the HUID is:
 * `<YYYY><MM><DD>-<HH><MM><SS>`
 * For example: `20251208-161530` represents December 8, 2025 at 16:15:30.
 *
 * This can be used to uniquely identify TODOs or other items in a human-readable way.
 *
 * Reference: Inspired by TSoding's approach
 * (https://www.youtube.com/watch?v=QH6KOEVnSZA&t=3411s)
 *
 * @returns {string} The generated HUID as a string.
 * @since 1.0.0
 */
export function getGeneratedHUID(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}
