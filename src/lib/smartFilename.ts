/**
 * Build a clean, structured "smart" filename preview.
 *
 *   smartFilename({
 *     base: 'mohammad rahman passport',
 *     type: 'pdf',
 *     ownerId: 'OWNER-2026-0001_SHARIYAR_NASIM',
 *     batch: 'SG_BATCH_01_2026',
 *   })
 *   // → "OWNER-2026-0001_SHARIYAR_NASIM__SG_BATCH_01_2026__MOHAMMAD_RAHMAN_PASSPORT.pdf"
 */
export interface SmartParts {
  base: string;
  type: 'pdf' | 'image' | 'document' | string;
  ownerId?: string;
  batch?: string;
}

const EXT: Record<string, string> = {
  pdf: 'pdf',
  image: 'jpg',
  document: 'docx',
};

export function sanitizeBase(input: string): string {
  return input
    .replace(/\.[a-z0-9]{2,5}$/i, '') // strip extension
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
    .slice(0, 60);
}

export function inferTypeFromName(name: string): 'pdf' | 'image' | 'document' {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'].includes(ext)) return 'image';
  return 'document';
}

export function smartFilename(parts: SmartParts): string {
  const ext = EXT[parts.type] ?? parts.type ?? 'bin';
  const segments = [parts.ownerId, parts.batch, sanitizeBase(parts.base)]
    .filter(Boolean)
    .join('__');
  return `${segments}.${ext}`;
}

export function typeBadgeFor(name: string): string {
  return (name.split('.').pop() ?? '').slice(0, 4).toUpperCase() || 'FILE';
}
