import { useEffect, useState } from 'react';
import { benefitsApi } from './api/benefitsApi';
import { useApi } from './hooks/useApi';
import { useSessions } from './hooks/useSessions';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useSoundMuted } from './hooks/useSoundMuted';
import { sfx } from './utils/sound';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import ChatView from './components/ChatView';
import Composer from './components/Composer';

const toolBtn = 'grid place-items-center rounded-[7px] border-0 bg-transparent p-[4.7px] transition-colors hover:bg-grey-96';

export default function App() {
  const topicsState = useApi(benefitsApi.getTopics);
  const { data: documents } = useApi(benefitsApi.getDocuments);
  const { sessions, active, activeId, busy, ask, newSession, openSession, deleteSession } = useSessions();
  const [muted, setMuted] = useSoundMuted();
  const [draft, setDraft] = useState('');

  // Tablet & phone: the sidebar is a drawer, closed by default; desktop: open by default.
  const narrow = useMediaQuery('(max-width: 900px)');
  const [sidebar, setSidebarState] = useState(() => ({ open: !narrow, narrow }));
  const sidebarOpen = sidebar.narrow === narrow ? sidebar.open : !narrow;
  const setSidebar = (open, withSound = false) => {
    setSidebarState({ open, narrow });
    if (withSound) sfx.tap();
  };
  const closeDrawer = () => narrow && setSidebar(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && narrow && sidebarOpen && setSidebarState({ open: false, narrow });
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [narrow, sidebarOpen]);

  const chat = activeId !== null;

  const submit = (text, opts) => {
    if (!text.trim() || busy) return;
    setDraft('');
    ask(text, opts);
  };
  const handleNew = () => {
    newSession();
    setDraft('');
    closeDrawer();
  };
  const handleOpen = (id) => {
    closeDrawer();
    if (id !== activeId) setDraft('');
    openSession(id);
  };
  const talkToPerson = () => {
    closeDrawer();
    submit('Talk to a person', { answerId: 'contacts' });
  };

  const composer = (
    <Composer variant={chat ? 'dock' : 'hero'} value={draft} onChange={setDraft} onSubmit={submit} busy={busy} autoFocus={!narrow} />
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <Sidebar
        open={sidebarOpen}
        sessions={sessions}
        activeId={activeId}
        muted={muted}
        onToggleMuted={() => setMuted(!muted)}
        onNew={handleNew}
        onOpen={handleOpen}
        onDelete={deleteSession}
        onClose={() => setSidebar(false, true)}
        onTalkToPerson={talkToPerson}
      />
      <div
        className={`fixed inset-0 z-45 hidden bg-[rgba(15,23,42,0.22)] transition-opacity duration-300 narrow:block ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setSidebar(false, true)}
      />

      <main className="relative h-full min-w-0 flex-1 overflow-hidden bg-white">
        {/* Desktop: floating tools when the sidebar is closed */}
        {!chat && !sidebarOpen && !narrow && (
          <div className="absolute top-4 left-4 z-20 flex animate-fade-down gap-0.5 rounded-[11px] bg-white/70 p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-md">
            <button className={toolBtn} onClick={() => setSidebar(true, true)} aria-label="Open sidebar" title="Open sidebar">
              <img src="/assets/icons/sidebar.svg" alt="" width="19" height="19" />
            </button>
            <button className={toolBtn} onClick={handleNew} aria-label="New session" title="New session">
              <img src="/assets/icons/plus.svg" alt="" width="19" height="19" />
            </button>
          </div>
        )}
        {/* Phone & tablet: top bar on the welcome screen */}
        {!chat && narrow && (
          <div className="absolute inset-x-0 top-0 z-20 flex h-[calc(54px+env(safe-area-inset-top))] animate-fade-down items-center justify-between border-b border-line-sb bg-white/95 px-2.5 pt-[env(safe-area-inset-top)] backdrop-blur-lg backdrop-saturate-[1.4]">
            <button className={`${toolBtn} rounded-[10px] p-2`} onClick={() => setSidebar(true, true)} aria-label="Open sidebar" title="Open sidebar">
              <img src="/assets/icons/sidebar.svg" alt="" width="19" height="19" />
            </button>
            <img src="/assets/logo.png" alt="FedPoint" width="104" height="35" className="h-[35px] w-[104px] object-cover" />
            <button className={`${toolBtn} rounded-[10px] p-2`} onClick={handleNew} aria-label="New session" title="New session">
              <img src="/assets/icons/plus.svg" alt="" width="19" height="19" />
            </button>
          </div>
        )}

        {chat ? (
          <ChatView
            key={activeId}
            session={active}
            busy={busy}
            documents={documents}
            showTools={!sidebarOpen || narrow}
            composer={composer}
            onAsk={(q) => submit(q)}
            onOpenSidebar={() => setSidebar(true, true)}
            onNew={handleNew}
          />
        ) : (
          <Welcome topicsState={topicsState} compact={sidebarOpen} composer={composer} onAsk={(q) => submit(q)} />
        )}
      </main>
    </div>
  );
}
