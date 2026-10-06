import { useRef, useState } from 'react';
import Icon from './Icon';
import { sfx } from '../utils/sound';

const toolBtn = 'grid place-items-center rounded-[7px] border-0 bg-transparent p-[4.7px] transition-colors hover:bg-grey-96';

function SessionItem({ session, active, onOpen, onDelete }) {
  return (
    <li className="overflow-hidden">
      <div
        className={`group relative mb-px flex items-center rounded-[7px] bg-(--sess-bg) transition-colors ${
          active
            ? '[--sess-bg:var(--color-blue-50)] shadow-[inset_3px_0_0_var(--color-blue)]'
            : '[--sess-bg:var(--color-white)] hover:[--sess-bg:var(--color-grey-98)]'
        }`}
      >
        <button
          className={`h-[37px] min-w-0 flex-1 overflow-hidden border-0 bg-transparent px-[11.8px] py-[7px] text-left text-[15px] leading-[23px] font-medium whitespace-nowrap ${active ? 'text-navy' : 'text-ink-700'}`}
          onClick={() => onOpen(session.id)}
          aria-current={active ? 'page' : undefined}
        >
          {session.title ? (
            <span className="block truncate">{session.title}</span>
          ) : (
            <span className="flex h-[23px] items-center" aria-label="Naming this session">
              <i className="skeleton-bar block h-[9px] w-[74%] animate-skel rounded-[5px]" />
            </span>
          )}
        </button>
        <button
          className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-[7px] border-0 bg-[linear-gradient(to_right,transparent,var(--sess-bg)_40%)] pl-3 text-ink-400 opacity-0 transition-[opacity,color] duration-200 group-hover:opacity-100 hover:text-ink-800 focus-visible:opacity-100"
          onClick={() => onDelete(session.id)}
          title="Remove session"
          aria-label={`Remove session ${session.title || ''}`}
        >
          <Icon name="x" size={13} />
        </button>
      </div>
    </li>
  );
}

export default function Sidebar({ open, sessions, activeId, muted, onToggleMuted, onNew, onOpen, onDelete, onClose, onTalkToPerson }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  const q = query.trim().toLowerCase();
  const list = q
    ? sessions.filter((s) => (s.title || '').toLowerCase().includes(q) || s.inputs.some((t) => t.toLowerCase().includes(q)))
    : sessions;

  const toggleSearch = () => {
    sfx.tap();
    if (searchOpen) {
      setSearchOpen(false);
      setQuery('');
    } else {
      setSearchOpen(true);
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  };

  return (
    <div
      className={`h-full flex-none overflow-hidden bg-white transition-[width] duration-450 ease-out-soft ${open ? 'w-[263px]' : 'w-0'} narrow:fixed narrow:inset-y-0 narrow:left-0 narrow:z-50 narrow:w-[284px] narrow:shadow-[0_0_48px_rgba(15,23,42,0.14)] narrow:transition-transform ${open ? 'narrow:translate-x-0' : 'narrow:-translate-x-[330px]'}`}
    >
      <aside className="h-full w-[263px] border-r border-line-sb bg-white narrow:w-[284px]" aria-label="Sessions">
        <div className="flex h-full flex-col justify-between px-[16.5px] py-[14px]">
          <div className="flex min-h-0 flex-1 flex-col gap-[9.5px]">
            <div className="flex items-center justify-between px-[7px] pt-[2.4px] pb-[4.7px]">
              <button className="border-0 bg-transparent p-0" onClick={onNew} aria-label="FedPoint Smart Assist home">
                <img src="/assets/logo.png" alt="FedPoint" width="119" height="40" className="h-10 w-[119px] object-cover" />
              </button>
              <div className="flex gap-[2.4px]">
                <button className={`${toolBtn} ${searchOpen ? 'bg-grey-96' : ''}`} onClick={toggleSearch} aria-label="Search sessions" title="Search sessions">
                  <img src="/assets/icons/search.svg" alt="" width="19" height="19" />
                </button>
                <button className={toolBtn} onClick={onClose} aria-label="Close sidebar" title="Close sidebar">
                  <img src="/assets/icons/sidebar.svg" alt="" width="19" height="19" />
                </button>
              </div>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity,margin-top] duration-280 ease-out-soft ${searchOpen ? 'mt-0 grid-rows-[1fr] opacity-100' : '-mt-[9.5px] grid-rows-[0fr] opacity-0'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mt-px mb-[3px] flex items-center gap-2 rounded-[9.5px] border border-line px-3 py-2 transition-[border-color,box-shadow] duration-200 focus-within:border-[#cfe2fb] focus-within:shadow-[0_0_0_3px_rgba(59,147,240,0.12)]">
                  <img src="/assets/icons/search.svg" alt="" width="16" height="16" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && toggleSearch()}
                    placeholder="Search sessions"
                    aria-label="Search sessions"
                    tabIndex={searchOpen ? 0 : -1}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm leading-5 text-ink-800 outline-0"
                  />
                </div>
              </div>
            </div>

            <div className="pt-[2.4px]">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-orange px-3.5 py-2.5 text-[15px] leading-5 font-bold tracking-[0.04em] text-ink-800 uppercase transition-[background-color,color,scale] duration-200 hover:bg-orange-dark hover:text-white active:scale-[0.98] active:bg-orange-darker active:text-white"
                onClick={onNew}
              >
                <Icon name="plus" size={18} strokeWidth={2.4} />
                <span>New Session</span>
              </button>
            </div>

            <div className="mt-[9.5px] min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-t border-line-soft pt-[9.5px] [scrollbar-width:thin]">
              <div className="px-[9.5px] py-[4.7px] text-xs leading-[19.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">Sessions</div>
              <ul className="m-0 list-none pt-[2.4px]">
                {list.map((s) => (
                  <SessionItem key={s.id} session={s} active={s.id === activeId} onOpen={onOpen} onDelete={onDelete} />
                ))}
              </ul>
              {list.length === 0 && (
                <p className="mt-1.5 px-[9.5px] py-1 text-[13px] leading-normal text-ink-400">
                  {q ? 'No sessions match your search.' : 'Your sessions will appear here. Ask a question to start one.'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-line-soft pt-2.5">
            <button
              className="flex items-center justify-center gap-[9px] rounded-lg border-2 border-navy bg-transparent px-3 py-2 text-sm leading-5 font-bold tracking-[0.04em] text-navy uppercase transition-colors hover:border-ink-900 hover:bg-blue-50 hover:text-ink-900"
              onClick={onTalkToPerson}
            >
              <Icon name="phone" />Talk to a person
            </button>
            <button
              role="switch"
              aria-checked={!muted}
              title={muted ? 'Turn sounds on' : 'Turn sounds off'}
              onClick={onToggleMuted}
              className="flex items-center gap-[9px] rounded-lg border-0 bg-transparent px-[11.8px] py-2 text-[13.5px] leading-5 font-medium text-ink-700 transition-colors hover:bg-grey-96"
            >
              <Icon name={muted ? 'volumeOff' : 'volume'} className="text-ink-500" />
              Sounds
              <span className={`relative ml-auto h-[18px] w-[30px] rounded-full transition-colors duration-250 ${muted ? 'bg-[#d1d5db]' : 'bg-blue'}`} aria-hidden="true">
                <i className={`absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-250 ease-out-soft ${muted ? '' : 'translate-x-3'}`} />
              </span>
            </button>
            <p className="m-0 flex gap-[7px] px-[11.8px] pt-0.5 pb-1 text-[11.5px] leading-[1.45] text-ink-400">
              <Icon name="lock" size={13} className="mt-0.5" />
              <span>Sessions stay in this browser tab and clear when you close it.</span>
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
