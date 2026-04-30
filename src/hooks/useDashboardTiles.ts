import { useState, useEffect, useCallback } from 'react';

export interface DashboardTile {
  id: string;
  title: string;
  kind: 'Image' | 'PDF' | 'Document';
  caption?: string;
  /** data: URL — persists across reloads (small files only). */
  dataUrl?: string;
  tone: 'red' | 'amber' | 'rose' | 'blue' | 'emerald';
}

const STORAGE_KEY = 'vh_dashboard_tiles_v1';

const defaultTiles: DashboardTile[] = [
  { id: 't1', title: 'Singapore Deployment Pack', kind: 'PDF', caption: '5 files', tone: 'red' },
  { id: 't2', title: 'Worker Onboarding Brief', kind: 'Document', caption: '8 documents', tone: 'amber' },
  { id: 't3', title: 'Compliance & Etiquette', kind: 'Document', caption: '14 references', tone: 'rose' },
];

const TONE_GRADIENTS: Record<DashboardTile['tone'], string> = {
  red: 'from-red-900/50 to-red-700/20',
  amber: 'from-amber-900/50 to-orange-700/20',
  rose: 'from-rose-900/50 to-pink-700/20',
  blue: 'from-blue-900/50 to-blue-700/20',
  emerald: 'from-emerald-900/50 to-emerald-700/20',
};

export const tileGradient = (tone: DashboardTile['tone']) => TONE_GRADIENTS[tone];

function load(): DashboardTile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTiles;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultTiles;
  } catch {
    return defaultTiles;
  }
}

function save(tiles: DashboardTile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
  } catch {
    /* quota: ignore */
  }
}

export function useDashboardTiles() {
  const [tiles, setTiles] = useState<DashboardTile[]>(() => load());

  useEffect(() => {
    save(tiles);
  }, [tiles]);

  const uploadToTile = useCallback((tileId: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        setTiles((prev) =>
          prev.map((t) =>
            t.id === tileId
              ? {
                  ...t,
                  dataUrl,
                  kind: isPdf ? 'PDF' : isImage ? 'Image' : 'Document',
                  caption: file.name,
                }
              : t,
          ),
        );
        resolve();
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }, []);

  const clearTile = useCallback((tileId: string) => {
    setTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, dataUrl: undefined, caption: undefined } : t)),
    );
  }, []);

  const addTile = useCallback(() => {
    const tones: DashboardTile['tone'][] = ['blue', 'emerald', 'amber', 'rose', 'red'];
    setTiles((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title: 'New Document',
        kind: 'Document',
        tone: tones[prev.length % tones.length],
      },
    ]);
  }, []);

  return { tiles, uploadToTile, clearTile, addTile };
}
