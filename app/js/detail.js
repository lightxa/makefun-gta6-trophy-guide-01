// Detail pane: one trophy's official text, its guide and its cited sources.
import { displayDescription, displayName } from './filters.js';

export function renderDetail(t, earned, spoilerOn, pane) {
  pane.replaceChildren();
  if (!t) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Pick a trophy from the list to see its guide and sources.';
    pane.append(p);
    return;
  }
  const h = document.createElement('h2');
  h.textContent = displayName(t, earned, spoilerOn);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = `\u201C${displayDescription(t, earned, spoilerOn)}\u201D — official description, grade ${t.grade}${t.count ? `, PSN count ${t.count}` : ''}${t.hidden ? ', hidden on PlayStation until earned' : ''}.`;
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = t.guide;
  const warn = document.createElement('p');
  warn.textContent = t.missable
    ? 'Missable: this one can pass you by. Read the guide above before the moment arrives.'
    : 'Not missable: this can be earned in free roam after the story.';
  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  const src = document.createElement('p');
  src.className = 'sources';
  src.textContent = 'Guide facts come from: ';
  t.sources.forEach((s, i) => {
    if (i > 0) src.append(document.createTextNode('; '));
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    src.append(a);
  });
  src.append(document.createTextNode('. Official name, description and grade as PlayStation publishes them.'));
  pane.append(h, official, guideTitle, guide, warn, srcTitle, src);
}
