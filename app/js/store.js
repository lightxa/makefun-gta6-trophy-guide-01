// Progress store: earned trophy names in localStorage, with export/import.
export const STORE_KEY = 'leonida-ledger-earned-v1';
export const SPOILER_KEY = 'leonida-ledger-spoiler-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort()));
}

export function exportProgress(earned) {
  const blob = new Blob(
    [JSON.stringify({ game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort() }, null, 2)],
    { type: 'application/json' },
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importProgress(file, knownNames) {
  const data = JSON.parse(await file.text());
  const list = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(list)) throw new Error('That file has no earned list.');
  const known = new Set(knownNames);
  return new Set(list.filter((n) => typeof n === 'string' && known.has(n)));
}

export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoiler(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}
