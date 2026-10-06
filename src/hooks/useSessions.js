import { useEffect, useRef, useState } from 'react';
import { benefitsApi, isCancelled } from '../api/benefitsApi';
import { EMPTY_HOUSEHOLD, coverageTier, extractNotes } from '../utils/sessionNotes';
import { sfx } from '../utils/sound';

// Sessions live in sessionStorage: kept for this browser tab, cleared when it closes.
const STORAGE_KEY = 'fedpoint.smart-assist.sessions';
const ERROR_TEXT = "Sorry, I couldn't get an answer right now. Please try again.";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function loadSessions() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

// Fallback session title when the answer doesn't provide one
function titleFromQuestion(question) {
  const q = question.replace(/[?.!]+$/, '').trim();
  return q.length > 34 ? q.slice(0, 32).trimEnd() + '…' : q;
}

const answerContext = (notes, household) => ({
  householdLabel: notes.find((n) => n.key === 'hh')?.label.replace('Covering: ', 'covering ') ?? null,
  tier: coverageTier(household),
});

export function useSessions() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(null);
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const controllers = useRef(new Map()); // session id -> AbortController

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      /* storage unavailable: sessions stay in memory */
    }
  }, [sessions]);

  useEffect(() => {
    const map = controllers.current;
    return () => map.forEach((c) => c.abort());
  }, []);

  const active = sessions.find((s) => s.id === activeId) || null;
  const busy = activeId != null && pendingIds.has(activeId);

  const setPending = (id, on) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const updateSession = (id, fn) => setSessions((list) => list.map((s) => (s.id === id ? fn(s) : s)));

  /**
   * Sends a question. `answerId` fetches a fixed answer instead of asking
   * (used by "Talk to a person").
   */
  const ask = (raw, { answerId } = {}) => {
    const text = raw.trim();
    if (!text || busy) return;
    sfx.send();

    const base = active || {
      id: uid(),
      title: '',
      createdAt: Date.now(),
      messages: [],
      notes: [],
      household: EMPTY_HOUSEHOLD,
      inputs: [],
    };
    const sid = base.id;
    const { notes, household } = extractNotes(text, base.household, base.notes);
    const updated = {
      ...base,
      notes,
      household,
      inputs: [...base.inputs, text],
      messages: [...base.messages, { id: uid(), role: 'user', text, ts: Date.now() }],
    };
    // The session moves to the top of the list, like recent chats.
    setSessions((list) => [updated, ...list.filter((s) => s.id !== sid)]);
    setActiveId(sid);
    setPending(sid, true);

    const controller = new AbortController();
    controllers.current.set(sid, controller);
    const opts = { signal: controller.signal };
    const request = answerId ? benefitsApi.getAnswer(answerId, opts) : benefitsApi.ask({ question: text }, opts);
    const context = answerContext(notes, household);

    request
      .then((answer) => {
        updateSession(sid, (s) => ({
          ...s,
          title: s.title || answer.title || titleFromQuestion(text),
          messages: [...s.messages, { id: uid(), role: 'assistant', answer, ...context, ts: Date.now() }],
        }));
        sfx.done();
      })
      .catch((err) => {
        if (isCancelled(err)) return;
        updateSession(sid, (s) => ({
          ...s,
          title: s.title || titleFromQuestion(text),
          messages: [...s.messages, { id: uid(), role: 'error', text: ERROR_TEXT, ts: Date.now() }],
        }));
      })
      .finally(() => {
        if (controllers.current.get(sid) === controller) controllers.current.delete(sid);
        setPending(sid, false);
      });
  };

  const newSession = () => {
    sfx.pop();
    setActiveId(null);
  };

  const openSession = (id) => {
    if (id === activeId) return;
    sfx.tap();
    setActiveId(id);
  };

  const deleteSession = (id) => {
    sfx.remove();
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    setPending(id, false);
    if (id === activeId) setActiveId(null);
    setSessions((list) => list.filter((s) => s.id !== id));
  };

  return { sessions, active, activeId, busy, pendingIds, ask, newSession, openSession, deleteSession };
}
