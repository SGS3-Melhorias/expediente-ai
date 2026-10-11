import { extractText, getDocumentProxy, getMeta } from "unpdf";

export type PdfExtraction = {
  text: string;
  pages: number;
  title?: string;
  truncated: boolean;
};

const MAX_CHARS = 180_000;

export async function extractPdf(buffer: ArrayBuffer | Uint8Array): Promise<PdfExtraction> {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const pdf = await getDocumentProxy(data);
  const meta = await getMeta(pdf).catch(() => null);
  const extracted = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(extracted.text)
    ? extracted.text
    : [String(extracted.text ?? "")];
  const labeled = pages
    .map((page, i) => `--- página ${i + 1} ---\n${page}`)
    .join("\n\n");
  const truncated = labeled.length > MAX_CHARS;
  return {
    text: truncated ? labeled.slice(0, MAX_CHARS) : labeled,
    pages: extracted.totalPages ?? pages.length,
    title: meta?.info?.Title ? String(meta.info.Title) : undefined,
    truncated,
  };
}

export function chunkText(text: string, size = 90_000): string[] {
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    chunks.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  return chunks;
}
