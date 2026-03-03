/**
 * Escapes HTML characters, duh.
 * @param text - The text to escape.
 * @returns The escaped HTML string.
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
