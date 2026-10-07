import { useLayoutEffect, useRef } from 'react';
import Icon from './Icon';

const MAX_HEIGHT = { hero: 160, dock: 200 };

/**
 * The message box. `variant` "hero" is the large box on the welcome screen,
 * "dock" the compact one under the conversation. The text lives in the parent
 * so it survives switching between the two.
 */
export default function Composer({ variant, value, onChange, onSubmit, busy, autoFocus = false }) {
  const inputRef = useRef(null);
  const hero = variant === 'hero';
  const ready = value.trim().length > 0 && !busy;

  // Grow with the text, up to a limit
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT[variant]) + 'px';
  }, [value, variant]);

  const submit = () => {
    if (ready) onSubmit(value);
  };

  return (
    <div className="relative z-[2] flex flex-col">
      <div
        className={`flex flex-1 cursor-text justify-between rounded-[14px] border bg-white shadow-comp transition-[border-color,box-shadow] duration-300 focus-within:border-blue-light focus-within:shadow-[0_0_0_4px_rgba(148,242,242,0.3),var(--shadow-comp)] ${
          hero
            ? 'min-h-[168px] flex-col border-white/70 p-5 short:min-h-[120px] short:p-4 phone:min-h-[116px] phone:pt-3.5 phone:pr-3.5 phone:pb-3 phone:pl-4'
            : 'min-h-[58px] flex-row items-end gap-2.5 border-line py-3 pr-3 pl-5 phone:min-h-[54px] phone:py-2.5 phone:pr-2.5 phone:pl-4'
        }`}
        onClick={(e) => {
          if (!e.target.closest('button')) inputRef.current?.focus();
        }}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          autoFocus={autoFocus}
          placeholder="Ask about a benefit or a cost"
          aria-label="Ask a question"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          className={`m-0 block w-full resize-none border-0 bg-transparent p-0 text-[15.5px] leading-[25.19px] tracking-[-0.27px] text-blue-vivid caret-blue outline-0 placeholder:text-ink-400 phone:text-base ${
            hero ? 'min-h-[50px] short:min-h-[40px] phone:min-h-[46px]' : 'mb-1 min-h-[25px] flex-1 text-[15px]'
          }`}
        />
        <div className={`flex items-center justify-end gap-2 ${hero ? 'pt-3' : ''}`}>
          <button
            type="button"
            onClick={submit}
            disabled={!ready}
            aria-label="Send question"
            className={`grid size-9 place-items-center rounded-lg border-0 p-0 transition-colors ${
              ready ? 'bg-orange text-ink-800 hover:bg-orange-dark hover:text-white active:scale-90' : 'bg-line-soft text-[#adadad]'
            }`}
          >
            <Icon name="arrowUp" size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
