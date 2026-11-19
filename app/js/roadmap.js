// Platinum roadmap: six stages built from the official descriptions.
export const STAGES = [
  {
    title: 'Opening and Chapter 1',
    text: 'Play Gone Fishing and finish Chapter 1. Pick up the easy moment trophies on the way: a cocktail with a view on Ocean Beach, and any activity you pass.',
    stage: 1,
  },
  {
    title: 'Chapters 2 and 3',
    text: 'Finish Chapters 2 and 3 and their named missions (The Cartel Heist, Child\u2019s Play). Clear side strands as they appear instead of leaving them for later.',
    stage: 2,
  },
  {
    title: 'Chapter 4 and the finale',
    text: 'Finish Chapter 4, the late missions (Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Before the finale, earn the partner-only and one-off moment trophies — Combat Focus, the VCIA departure, the armoured truck.',
    stage: 3,
  },
  {
    title: 'Side strands and strangers',
    text: 'Finish the final missions for Andy, Kenton, Billy, Randy and Tyrone, hunt Bret\u2019s unique animal, beat Cal at fishing, and complete 8 stranger strands. Try every activity type once for Master of None.',
    stage: 4,
  },
  {
    title: 'Collectibles and counts',
    text: 'Sweep Leonida region by region: 52 areas, 18 meditation spots, 100 WAiNK locations, 3 card sets, 100 vehicles, 8 garages. Pair the sweeps — one trip can cover exploration, meditation and WAiNK at once.',
    stage: 5,
  },
  {
    title: 'Grinds and the platinum',
    text: 'Close the long counters: 42 gold Shooting Range medals, 14 drone-race wins, 20 race wins, 250 stunts, 50 challenges, 5 bank vaults, 9 gang operations, $250,000 laundered, $100,000 spent, 500 choices. The 100% completion gold and then the platinum pop as the last counters close.',
    stage: 6,
  },
];

export function stageTrophies(trophies, stage) {
  return trophies.filter((t) => t.stage === stage).map((t) => t.name);
}

export function renderRoadmap(trophies, container) {
  container.replaceChildren();
  for (const s of STAGES) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = s.title;
    const p = document.createElement('p');
    p.textContent = s.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.textContent = `Trophies: ${stageTrophies(trophies, s.stage).join(' · ')}`;
    li.append(h, p, names);
    container.append(li);
  }
}
