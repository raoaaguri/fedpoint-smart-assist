// Mock-only: answers questions that exactly match a Q&A file (public/data/qa/*.json).
// Follow-ups walk the document in order: the rest of the same section, then the next section.

// Ignores case, punctuation and extra spaces, so "what is double up max" matches "What is Double-Up Max?"
const norm = (s) => s.toLowerCase().replace(/['’‘]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

function followUpsFor(qa, i) {
  const next = [];
  for (let j = i + 1; j < qa.length && next.length < 3; j++) {
    if (qa[j].section === qa[i].section) next.push(qa[j].question);
    else {
      next.push(qa[j].question); // first question of the next section
      break;
    }
  }
  return next;
}

/** Returns an Answer built from the Q&A file, or null when the question isn't in it. */
export function qaAnswer(file, text) {
  const i = file.qa.findIndex((q) => norm(q.question) === norm(text));
  if (i < 0) return null;
  const item = file.qa[i];
  return {
    id: item.id,
    title: item.question,
    topic: file.topic,
    showHouseholdNote: false,
    blocks: [{ type: 'paragraph', text: item.answer }],
    sources: file.sourceDocs,
    followUps: followUpsFor(file.qa, i),
  };
}
