import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon';
import BloubFace from './BloubFace';
import ChipButton from './ChipButton';
import AnswerBlocks, { NotedTag } from './answer/AnswerBlocks';
import { sfx } from '../utils/sound';

const toolBtn = 'grid place-items-center rounded-[7px] border-0 bg-transparent p-[4.7px] transition-colors hover:bg-grey-96';

function stamp(ts) {
  const d = new Date(ts);
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const today = new Date().toDateString() === d.toDateString();
  return `${today ? 'Today' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${time}`;
}

function AssistantRow({ fresh, children }) {
  return (
    <div className={`mb-[26px] grid grid-cols-[26px_minmax(0,1fr)] items-start gap-x-3.5 phone:mb-[22px] phone:grid-cols-[24px_minmax(0,1fr)] phone:gap-x-2.5 ${fresh ? 'animate-fade-up' : ''}`}>
      <div className="grid h-[26px] place-items-center"><BloubFace size={26} /></div>
      <div className="relative min-w-0">{children}</div>
    </div>
  );
}

function Feedback() {
  const [sent, setSent] = useState(false);
  const btn = 'grid size-7 place-items-center rounded-lg border-0 bg-transparent p-0 text-ink-400 transition-colors hover:bg-grey-96 hover:text-ink-700';
  const give = () => {
    sfx.tap();
    setSent(true);
  };
  return (
    <div className="mt-2 -ml-1.5 flex min-h-[30px] items-center gap-0.5 text-[12.5px] text-ink-400">
      {sent ? <span className="pl-1.5">Thanks for the feedback.</span> : (
        <>
          <span className="mr-1 ml-1.5">Was this helpful?</span>
          <button className={btn} onClick={give} aria-label="Yes, helpful"><Icon name="up" size={15} /></button>
          <button className={btn} onClick={give} aria-label="No, not helpful"><Icon name="up" size={15} className="rotate-180" /></button>
        </>
      )}
    </div>
  );
}

function AssistantMessage({ message, documents, busy, fresh, onAsk }) {
  const { answer, householdLabel, tier } = message;
  return (
    <AssistantRow fresh={fresh}>
      <div className="pt-px text-base leading-[1.62] text-ink-800 phone:text-[14.5px] [&>:last-child]:mb-0">
        {answer.showHouseholdNote && householdLabel && <NotedTag label={householdLabel} />}
        <AnswerBlocks blocks={answer.blocks} tier={tier} />
      </div>
      <div className={fresh ? 'animate-fade-up' : ''} style={fresh ? { animationDelay: '0.1s' } : undefined}>
        {answer.sources?.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
            <span className="mr-0.5 text-[11px] leading-4 font-semibold tracking-[0.06em] uppercase">Source</span>
            {answer.sources.map((s) => (
              <span key={s} className="inline-flex items-center gap-[5px] rounded-full border border-line-soft bg-grey-98 px-[9px] py-[3px] text-ink-600">
                <Icon name="doc" size={12} />{documents?.[s] || s}
              </span>
            ))}
          </div>
        )}
        <Feedback />
        {answer.followUps?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {answer.followUps.map((q) => <ChipButton key={q} disabled={busy} onClick={() => onAsk(q)}>{q}</ChipButton>)}
          </div>
        )}
      </div>
    </AssistantRow>
  );
}

function Thinking() {
  return (
    <AssistantRow fresh>
      <div className="flex min-h-[26px] items-center gap-2.5 text-sm leading-[22px]" role="status" aria-live="polite">
        <span className="text-shimmer inline-block animate-shimmer whitespace-nowrap">Thinking…</span>
      </div>
    </AssistantRow>
  );
}

/** Static version of the FedPoint wave behind the dock. */
function DockWave() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[calc(100%+64px)] overflow-hidden [mask-image:linear-gradient(to_top,#000_0%,rgba(0,0,0,0.92)_38%,transparent_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(to_top,rgba(208,230,251,0.95),rgba(232,252,252,0.55)_45%,rgba(232,252,252,0))]"
      aria-hidden="true"
    >
      <div className="absolute -right-[8%] -bottom-8 -left-[8%] h-[calc(82%+32px)] blur-[22px]">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="block size-full">
          <defs>
            <linearGradient id="waveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#94f2f2" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#248aed" stopOpacity="0.45" />
              <stop offset="1" stopColor="#0d63dc" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path d="M0 118 C 220 70 440 160 720 116 S 1200 48 1440 92 L 1440 200 L 0 200 Z" fill="url(#waveB)" />
        </svg>
      </div>
      <div className="absolute -right-[8%] -bottom-8 -left-[8%] h-[calc(82%+32px)] blur-[16px]">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="block size-full">
          <defs>
            <linearGradient id="waveA" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#248aed" stopOpacity="0.65" />
              <stop offset="0.55" stopColor="#72b3f3" stopOpacity="0.55" />
              <stop offset="1" stopColor="#94f2f2" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d="M0 150 C 300 108 560 188 880 146 S 1260 96 1440 132 L 1440 200 L 0 200 Z" fill="url(#waveA)" />
        </svg>
      </div>
      <div className="absolute -right-[8%] -bottom-8 -left-[8%] h-[calc(82%+32px)] opacity-85 blur-[7px]">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="block size-full">
          <path d="M0 110 C 240 60 480 158 760 106 S 1240 40 1440 84" fill="none" stroke="#33e6e6" strokeWidth="7" strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
          <path d="M0 130 C 250 86 500 172 790 128 S 1250 66 1440 108" fill="none" stroke="#fff" strokeWidth="5" strokeOpacity="0.55" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/**
 * One session's conversation. Mount it with key={session.id} so switching
 * sessions starts fresh (scroll position, entrance animations).
 */
export default function ChatView({ session, busy, documents, showTools, composer, onAsk, onOpenSidebar, onNew }) {
  const scroller = useRef(null);
  const stick = useRef(true);
  const [openedAt] = useState(() => Date.now());
  const [showToBottom, setShowToBottom] = useState(false);
  const messages = session?.messages ?? [];

  // Start at the newest message when the session opens
  useLayoutEffect(() => {
    const s = scroller.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, []);

  // Follow new messages unless the reader scrolled up. Asking a new question
  // (typed or a follow-up chip) always brings the conversation back into view.
  const lastRole = messages[messages.length - 1]?.role;
  useEffect(() => {
    const s = scroller.current;
    if (lastRole === 'user') stick.current = true;
    if (s && stick.current) s.scrollTo({ top: s.scrollHeight, behavior: 'smooth' });
  }, [messages.length, busy, lastRole]);

  const onScroll = () => {
    const s = scroller.current;
    const gap = s.scrollHeight - s.clientHeight - s.scrollTop;
    setShowToBottom(gap >= 64);
    if (gap < 8) stick.current = true;
  };
  const release = () => { stick.current = false; };
  const toBottom = () => {
    stick.current = true;
    const s = scroller.current;
    s.scrollTo({ top: s.scrollHeight, behavior: 'smooth' });
  };

  return (
    <section className="absolute inset-0 flex animate-fade-up flex-col">
      <header className="relative z-[5] flex h-[58px] flex-none items-center justify-between gap-3 bg-white/90 pr-[18px] pl-7 backdrop-blur-md backdrop-saturate-[1.4] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-linear-to-r after:from-blue-dark after:via-blue after:via-55% after:to-aqua-light narrow:h-[calc(54px+env(safe-area-inset-top))] narrow:px-3 narrow:pt-[env(safe-area-inset-top)]">
        <div className="flex min-w-0 items-center gap-2.5">
          {showTools && (
            <span className="-ml-3 flex gap-0.5 narrow:ml-0">
              <button className={toolBtn} onClick={onOpenSidebar} aria-label="Open sidebar" title="Open sidebar">
                <img src="/assets/icons/sidebar.svg" alt="" width="19" height="19" />
              </button>
              <button className={toolBtn} onClick={onNew} aria-label="New session" title="New session">
                <img src="/assets/icons/plus.svg" alt="" width="19" height="19" />
              </button>
            </span>
          )}
          <h2 className="m-0 min-w-0 truncate text-[17px] leading-[22px] font-bold text-navy phone:text-base">
            {session?.title || (
              <span className="flex h-[23px] items-center" aria-label="Naming this session">
                <i className="skeleton-bar block h-[11px] w-[180px] animate-skel rounded-[5px]" />
              </span>
            )}
          </h2>
        </div>
        <div className="flex flex-none items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 text-[12.5px] leading-[18px] text-ink-500 wide-down:hidden">
            <Icon name="info" size={14} />General guidance · not signed in
          </span>
        </div>
      </header>

      <div
        ref={scroller}
        onScroll={onScroll}
        onWheel={(e) => e.deltaY < 0 && release()}
        onTouchMove={release}
        onKeyDown={(e) => ['ArrowUp', 'PageUp', 'Home'].includes(e.key) && release()}
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto outline-none phone:no-scrollbar"
      >
        <div className="mx-auto box-content max-w-[760px] px-7 pt-[22px] pb-9 narrow:px-5 narrow:pt-[18px] narrow:pb-7 phone:px-3.5 phone:pt-4 phone:pb-6" aria-live="polite">
          {session && (
            <div className="mt-1 mb-[22px] text-center text-[11.5px] leading-4 font-semibold tracking-[0.14em] text-ink-400 uppercase phone:mb-[18px]">
              {stamp(session.createdAt)}
            </div>
          )}
          {messages.map((m) => {
            const fresh = m.ts >= openedAt;
            if (m.role === 'user') {
              return (
                <div key={m.id} className={`mb-[26px] flex justify-end phone:mb-[22px] ${fresh ? 'origin-bottom-right animate-user-in' : ''}`}>
                  <div className="max-w-[min(78%,560px)] rounded-[14px_14px_4px_14px] bg-blue-50 px-4 py-2.5 text-base leading-[23px] font-medium whitespace-pre-wrap text-blue-vivid [overflow-wrap:anywhere] phone:max-w-[88%]">
                    {m.text}
                  </div>
                </div>
              );
            }
            if (m.role === 'error') {
              return (
                <AssistantRow key={m.id} fresh={fresh}>
                  <div className="flex items-start gap-2.5 rounded-[10px] border border-blue-100 bg-blue-50 px-3.5 py-[11px] text-[15px] leading-[1.55] text-ink-700" role="alert">
                    <Icon name="info" className="mt-0.5 text-blue-vivid" />
                    <span>{m.text}</span>
                  </div>
                </AssistantRow>
              );
            }
            return <AssistantMessage key={m.id} message={m} documents={documents} busy={busy} fresh={fresh} onAsk={onAsk} />;
          })}
          {busy && <Thinking />}
        </div>
      </div>

      <div className="relative flex-none px-7 pb-3 narrow:px-4 narrow:pb-[calc(10px+env(safe-area-inset-bottom))] phone:px-2.5 phone:pb-[calc(8px+env(safe-area-inset-bottom))]">
        <DockWave />
        <button
          onClick={toBottom}
          aria-label="Scroll to latest"
          tabIndex={showToBottom ? 0 : -1}
          className={`absolute -top-12 left-1/2 z-[3] grid size-[34px] -translate-x-1/2 place-items-center rounded-full border border-line bg-white p-0 text-ink-700 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.2)] transition-[opacity,translate,scale] duration-300 ease-out-soft phone:-top-11 ${showToBottom ? 'opacity-100' : 'pointer-events-none translate-y-2 scale-90 opacity-0'}`}
        >
          <Icon name="arrowDown" />
        </button>
        <div className="relative z-[2] mx-auto max-w-[788px]">
          {composer}
          <p className="mt-[9px] flex items-center justify-center gap-1.5 text-center text-[11.5px] leading-[1.45] text-ink-500 phone:mt-[7px] phone:text-[11px]">
            <Icon name="info" size={12} className="phone:hidden" />
            <span>
              General information from FedPoint's 2026 plan documents. It can't see your elections or claims.
              <span className="phone:hidden"> Please don't share SSNs or medical details.</span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
