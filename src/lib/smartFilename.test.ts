import { describe, it, expect } from 'vitest';
import { smartFilename, sanitizeBase, typeBadgeFor, inferTypeFromName } from '@/lib/smartFilename';

describe('smartFilename', () => {
  it('sanitizes spaces and casing', () => {
    expect(sanitizeBase('mohammad rahman passport!!')).toBe('MOHAMMAD_RAHMAN_PASSPORT');
  });

  it('strips existing extension before sanitizing', () => {
    expect(sanitizeBase('Photo Final v2.jpg')).toBe('PHOTO_FINAL_V2');
  });

  it('joins owner + batch + base with double underscore and infers extension', () => {
    expect(
      smartFilename({
        base: 'partnership agreement',
        type: 'pdf',
        ownerId: 'OWNER-2026-0001_SHARIYAR_NASIM',
        batch: 'SG_BATCH_01_2026',
      }),
    ).toBe('OWNER-2026-0001_SHARIYAR_NASIM__SG_BATCH_01_2026__PARTNERSHIP_AGREEMENT.pdf');
  });

  it('produces a name without spaces, regardless of input', () => {
    const out = smartFilename({ base: 'hello world  spaces   ', type: 'pdf' });
    expect(out).not.toMatch(/\s/);
  });

  it('infers types from extension', () => {
    expect(inferTypeFromName('a.pdf')).toBe('pdf');
    expect(inferTypeFromName('a.JPG')).toBe('image');
    expect(inferTypeFromName('a.docx')).toBe('document');
  });

  it('badge is uppercase and short', () => {
    expect(typeBadgeFor('foo.pdf')).toBe('PDF');
    expect(typeBadgeFor('foo.jpeg')).toBe('JPEG');
  });
});
