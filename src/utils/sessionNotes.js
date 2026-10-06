// Picks "notes" out of what the user types (who they cover, dental work, life events...).
// Ported unchanged from the HTML prototype's extract() and tier(). Runs only in the browser.

export const EMPTY_HOUSEHOLD = { spouse: false, kids: 0, family: false, solo: false };

const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5 };

export function coverageTier(h) {
  if (h.solo) return 'Employee';
  const d = (h.spouse ? 1 : 0) + h.kids;
  if (d >= 2 || h.family) return 'Family';
  if (d === 1) return 'Employee + 1';
  return null;
}

/** Returns the next { household, notes } without mutating the inputs. */
export function extractNotes(text, prevHousehold, prevNotes) {
  const t = text.toLowerCase();
  const h = { ...prevHousehold };
  const notes = prevNotes.map((n) => ({ ...n }));
  const setNote = (key, label) => {
    const i = notes.findIndex((n) => n.key === key);
    if (i >= 0) notes[i].label = label;
    else notes.push({ key, label });
  };

  if (/\b(just me|only me|myself|single|only for me)\b/.test(t)) {
    h.solo = true; h.spouse = false; h.kids = 0; h.family = false;
  } else {
    let hit = false;
    if (/\b(spouse|wife|husband|partner)\b/.test(t)) { h.spouse = true; hit = true; }
    const km = t.match(/\b(\d+|one|two|three|four|five)\s+(kids|children|child|sons|daughters)\b/);
    if (km) { h.kids = NUM[km[1]] || parseInt(km[1], 10); hit = true; }
    else if (/\b(kid|kids|child|children|son|daughter|baby|newborn)\b/.test(t)) { if (h.kids === 0) h.kids = 1; hit = true; }
    if (/\bfamily\b/.test(t)) { h.family = true; hit = true; }
    if (hit) h.solo = false;
  }

  if (h.solo) setNote('hh', 'Covering: just you');
  else if (h.spouse || h.kids || h.family) {
    const parts = ['you'];
    if (h.spouse) parts.push('spouse');
    if (h.kids) parts.push(h.kids + (h.kids > 1 ? ' children' : ' child'));
    setNote('hh', 'Covering: ' + (parts.length > 1 ? parts.join(', ') : 'your family'));
  }

  if (/\b(braces|ortho|orthodont)/.test(t)) setNote('ortho', 'Interested in orthodontia');
  const work = [];
  ['root canal', 'crown', 'filling', 'implant', 'denture'].forEach((w) => { if (t.includes(w)) work.push(w); });
  if (work.length) setNote('work', 'Dental work: ' + work.join(', '));
  if (/\b(glasses|contacts|lasik|frames)\b/.test(t)) setNote('vis', 'Vision need: ' + (/contacts/.test(t) ? 'contacts' : /lasik/.test(t) ? 'Lasik' : 'glasses'));
  if (/\b(prescription|medication|meds|drug)/.test(t)) setNote('rx', 'Takes regular prescriptions');
  if (/\b(baby|newborn|birth|pregnan)/.test(t)) setNote('event', 'Life event: new baby');
  else if (/\b(adopt)/.test(t)) setNote('event', 'Life event: adoption');
  else if (/\b(married|marriage|wedding)/.test(t)) setNote('event', 'Life event: marriage');
  else if (/\b(lost|losing|lose).*(coverage|insurance)/.test(t)) setNote('event', 'Life event: loss of other coverage');

  return { household: h, notes };
}
