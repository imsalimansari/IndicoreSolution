/* Validates e-mail attachments sent from the admin panel (base64 in JSON, no extra dependency).
   Limits keep us safely under Gmail / Brevo size limits and under the free server's memory. */
export const LIMITS = { files: 5, each: 3 * 1024 * 1024, total: 5 * 1024 * 1024 };
const ALLOWED = /\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|webp|gif|txt|csv|zip)$/i;   // no .exe/.js/.html etc.
const mb = n => (n / 1024 / 1024).toFixed(0) + " MB";

/* returns { files: [{ filename, content: Buffer }] } or { error: "message for the admin" } */
export function readAttachments(list) {
  if (list == null) return { files: [] };
  if (!Array.isArray(list)) return { error: "Invalid attachments." };
  if (list.length > LIMITS.files) return { error: `You can attach up to ${LIMITS.files} files.` };
  const files = []; let total = 0;
  for (const a of list) {
    const name = String(a?.name || "").replace(/[\\/\x00-\x1f"<>|:*?]/g, "_").trim().slice(0, 120);
    if (!name || !ALLOWED.test(name)) return { error: `"${name || "file"}" is not an allowed file type (PDF, Word, Excel, PowerPoint, images, TXT, CSV, ZIP).` };
    const data = String(a?.data || "");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return { error: `"${name}" could not be read. Please attach it again.` };
    const content = Buffer.from(data, "base64");
    if (!content.length) return { error: `"${name}" is empty.` };
    if (content.length > LIMITS.each) return { error: `"${name}" is larger than ${mb(LIMITS.each)}.` };
    total += content.length;
    if (total > LIMITS.total) return { error: `Attachments together must be under ${mb(LIMITS.total)}.` };
    files.push({ filename: name, content });
  }
  return { files };
}
