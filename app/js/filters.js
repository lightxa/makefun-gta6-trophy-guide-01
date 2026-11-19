// Filter rules: kind, grade, search text and the spoiler setting.
export function trophyMatches(t, state) {
  if (state.kind === 'missable' && !t.missable) return false;
  if (state.kind === 'online') return false; // No online trophies in the official list.
  if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// Spoiler rule: hide the name and description of story trophies until earned.
export function displayName(t, earned, spoilerOn) {
  if (spoilerOn && t.kind === 'story' && !earned.has(t.name)) return 'Hidden story trophy';
  return t.name;
}

export function displayDescription(t, earned, spoilerOn) {
  if (spoilerOn && t.kind === 'story' && !earned.has(t.name)) return 'Hidden until earned — turn the spoiler setting off to reveal it.';
  return t.description;
}
