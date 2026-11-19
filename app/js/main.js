// Leonida Ledger boot: fetch the trophy data, render the checklist, wire the tracker.
import { exportProgress, importProgress, loadEarned, loadSpoiler, saveEarned, saveSpoiler } from './store.js';
import { displayDescription, displayName, trophyMatches } from './filters.js';
import { renderRoadmap } from './roadmap.js';
import { renderDetail } from './detail.js';

const params = new URLSearchParams(location.search);
const trophies = (await (await fetch('data/trophies.json')).json()).trophies;

let earned = loadEarned();
let spoilerOn = loadSpoiler();
const state = { kind: 'all', grade: 'all', search: '' };
let selected = null;
let view = 'checklist';

// Screenshot scenes (?shot=cover|guide|roadmap|settings) seed a fixed demo state.
const shot = params.get('shot');
if (shot) {
  const demo = trophies.slice(0, 13).map((t) => t.name);
  earned = new Set(demo);
  if (shot === 'guide') selected = trophies.find((t) => t.id === 17) ?? null;
  if (shot === 'roadmap') view = 'roadmap';
  if (shot === 'settings') {
    // Few earned, so the spoiler rule is visible at once: unearned story
    // trophies show as "Hidden story trophy" in the list below.
    earned = new Set(trophies.slice(0, 2).map((t) => t.name));
    spoilerOn = true;
  }
}

const list = document.getElementById('trophyList');
const detailPane = document.getElementById('detailPane');
const resultCount = document.getElementById('resultCount');

function gradeLabel(g) {
  return g === 'platinum' ? 'Platinum' : g[0].toUpperCase() + g.slice(1);
}

function renderProgress() {
  const total = trophies.length;
  document.getElementById('earnedCount').textContent = earned.size;
  document.getElementById('barFill').style.width = `${Math.round((earned.size / total) * 100)}%`;
  const counts = {};
  for (const t of trophies) if (earned.has(t.name)) counts[t.grade] = (counts[t.grade] ?? 0) + 1;
  document.getElementById('gradeCounts').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map((g) => `${counts[g] ?? 0} ${g}`).join(' · ');
  const next = trophies.find((t) => !earned.has(t.name));
  document.getElementById('nextUp').textContent = next ? `Next up: ${next.name}` : 'Platinum earned — Leonida Legend.';
}

function trophyRow(t) {
  const li = document.createElement('li');
  li.className = 'trophy-row' + (earned.has(t.name) ? ' earned' : '') + (selected === t ? ' selected' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Earned: ${t.name}`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveEarned(earned);
    renderAll();
  });
  const body = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'trophy-name';
  name.textContent = displayName(t, earned, spoilerOn);
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = displayDescription(t, earned, spoilerOn);
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  const grade = document.createElement('span');
  grade.className = `pill ${t.grade}`;
  grade.textContent = gradeLabel(t.grade);
  meta.append(grade);
  const kind = document.createElement('span');
  kind.className = 'pill kind';
  kind.textContent = t.kind;
  meta.append(kind);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'pill missable';
    m.textContent = 'Missable';
    meta.append(m);
  }
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'pill hidden';
    h.textContent = 'Hidden';
    meta.append(h);
  }
  if (t.count) {
    const c = document.createElement('span');
    c.className = 'pill count';
    c.textContent = `Count: ${t.count.toLocaleString('en-US')}`;
    meta.append(c);
  }
  body.append(name, desc, meta);
  li.append(box, body, document.createElement('span'));
  li.addEventListener('click', (e) => {
    if (e.target === box) return;
    selected = t;
    renderAll();
  });
  return li;
}

function renderList() {
  const shown = trophies.filter((t) => trophyMatches(t, state));
  list.replaceChildren(...shown.map(trophyRow));
  resultCount.textContent = state.kind === 'online'
    ? 'No online trophies: the official GTA 6 list has none, so this filter is empty by design.'
    : `Showing ${shown.length} of ${trophies.length} trophies.`;
  renderDetail(selected, earned, spoilerOn, detailPane);
}

function renderMissable() {
  const box = document.getElementById('missableList');
  box.replaceChildren(...trophies.filter((t) => t.missable).map(trophyRow));
}

function renderAll() {
  renderProgress();
  renderList();
  renderMissable();
  renderRoadmap(trophies, document.getElementById('roadmapStages'));
}

function showView(name) {
  view = name;
  for (const button of document.querySelectorAll('.tabs button')) {
    button.classList.toggle('active', button.dataset.view === name);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${name}`;
  }
}

for (const button of document.querySelectorAll('.tabs button')) {
  button.addEventListener('click', () => showView(button.dataset.view));
}
for (const button of document.querySelectorAll('#kindFilters button')) {
  button.addEventListener('click', () => {
    state.kind = button.dataset.kind;
    for (const b of document.querySelectorAll('#kindFilters button')) b.classList.toggle('active', b === button);
    renderList();
  });
}
document.getElementById('grade').addEventListener('change', (e) => {
  state.grade = e.target.value;
  renderList();
});
document.getElementById('search').addEventListener('input', (e) => {
  state.search = e.target.value.trim();
  renderList();
});
const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = spoilerOn;
spoilerBox.addEventListener('change', () => {
  spoilerOn = spoilerBox.checked;
  saveSpoiler(spoilerOn);
  renderAll();
});
document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = await importProgress(file, trophies.map((t) => t.name));
    saveEarned(earned);
    renderAll();
  } catch {
    resultCount.textContent = 'That file could not be imported — export a progress file from this guide and try again.';
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  earned = new Set();
  saveEarned(earned);
  renderAll();
});

showView(view);
renderAll();
