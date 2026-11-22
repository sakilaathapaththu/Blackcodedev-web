const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes user input before it is placed inside an HTML email. */
export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (ch) => map[ch]);
}
