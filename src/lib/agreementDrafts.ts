// Lightweight localStorage-backed draft store for generated agreements.
// Each draft references a template (or existing agreement) and tracks its
// version + timestamps so users can reopen, edit notes, and re-generate.

export type DraftKind = 'partnership' | 'worker' | 'employer' | 'receipt' | 'service';

export interface AgreementDraft {
  id: string;
  key: string;            // stable key per template/agreement (e.g. "tpl:partnership" or "agr:a1")
  kind: DraftKind;
  title: string;
  version: number;        // 1-based, auto-incremented per `key`
  notes: string;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

const STORAGE_KEY = 'visahobe:agreement-drafts:v1';

function read(): AgreementDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(drafts: AgreementDraft[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    window.dispatchEvent(new CustomEvent('agreement-drafts:changed'));
  } catch { /* ignore quota */ }
}

export function listDrafts(): AgreementDraft[] {
  return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDraft(id: string): AgreementDraft | undefined {
  return read().find(d => d.id === id);
}

export function nextVersionFor(key: string): number {
  const existing = read().filter(d => d.key === key);
  return existing.length ? Math.max(...existing.map(d => d.version)) + 1 : 1;
}

export function saveDraft(input: {
  key: string;
  kind: DraftKind;
  title: string;
  notes?: string;
}): AgreementDraft {
  const now = new Date().toISOString();
  const draft: AgreementDraft = {
    id: `drf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    key: input.key,
    kind: input.kind,
    title: input.title,
    version: nextVersionFor(input.key),
    notes: input.notes ?? '',
    createdAt: now,
    updatedAt: now,
  };
  write([draft, ...read()]);
  return draft;
}

export function updateDraftNotes(id: string, notes: string): AgreementDraft | undefined {
  const drafts = read();
  const i = drafts.findIndex(d => d.id === id);
  if (i === -1) return undefined;
  drafts[i] = { ...drafts[i], notes, updatedAt: new Date().toISOString() };
  write(drafts);
  return drafts[i];
}

export function regenerateDraft(id: string): AgreementDraft | undefined {
  // Save a new versioned draft for the same key, copying title+notes.
  const src = getDraft(id);
  if (!src) return undefined;
  return saveDraft({ key: src.key, kind: src.kind, title: src.title, notes: src.notes });
}

export function deleteDraft(id: string) {
  write(read().filter(d => d.id !== id));
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
