import { useState } from 'react';
import Icon from './Icon';
import BloubFace from './BloubFace';
import ChipButton from './ChipButton';


function greeting() {
  const h = new Date().getHours();
  return h < 5 || h >= 17 ? 'Good evening' : h < 12 ? 'Good morning' : 'Good afternoon';
}

// Like the Smart Assist tiles: a blue ring icon, then the text. Narrow cards stack the icon above.
function SuggestionCard({ topic, index, onAsk }) {
  return (
    <button
      className="group relative flex min-h-[78px] font-din items-start gap-3 overflow-hidden rounded-xl border border-line bg-white py-3.5 pr-3.5 pl-[13px] text-left shadow-[0_1px_2px_rgba(0,16,41,0.04)] transition-[translate,scale,box-shadow,border-color] duration-350 ease-out-soft [-webkit-tap-highlight-color:transparent] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-linear-to-r before:from-aqua before:to-blue before:transition-transform before:duration-450 before:ease-out-soft hover:-translate-y-0.5 hover:border-blue-light hover:shadow-[0_12px_28px_-14px_rgba(0,48,143,0.28),0_2px_6px_rgba(0,16,41,0.05)] hover:before:scale-x-100 active:scale-[0.97] animate-card-in @max-[860px]:flex-col @max-[860px]:gap-2.5 phone:min-h-0 phone:gap-2.5 phone:px-[11px] phone:py-3"
      style={{ animationDelay: `${0.4 + index * 0.07}s` }}
      aria-label={topic.description ? `${topic.title}: ${topic.description}` : topic.title}
      onClick={() => onAsk(topic.question)}
    >
      <span className="grid size-11 flex-none place-items-center rounded-full border-2 border-blue-vivid bg-white text-blue-vivid transition-[background-color,color,scale] duration-300 group-hover:scale-[1.06] group-hover:bg-blue-vivid group-hover:text-white phone:size-[38px]">
        <Icon name={topic.icon} size={21} strokeWidth={2} />
      </span>
      <span className="min-w-0 pt-px @max-[860px]:pt-0">
        <span className="block text-base leading-[1.25] font-semibold text-ink-900 transition-colors duration-250 group-hover:text-blue-vivid phone:text-[15px]">
          {topic.title}
        </span>
        {topic.description && (
          <span className="mt-[3px] line-clamp-2 text-[13.5px] leading-[1.35] text-ink-500 @max-[860px]:line-clamp-3 phone:text-[12.5px] tiny:w-[70%]">
            {topic.description}
          </span>
        )}
      </span>
    </button>
  );
}

function CardSkeleton() {
  return <div className="h-[78px] animate-pulse rounded-xl border border-line bg-grey-98" aria-hidden="true" />;
}

function Suggestions({ topicsState, onAsk }) {
  const { data, loading, error, reload } = topicsState;
  const cards = data ? data.suggestions.map((k) => data.topics.find((t) => t.key === k)).filter(Boolean) : [];

  return (
    <div className="@container mt-10 phone:mt-[26px]">
      <div className="mb-[10.5px] animate-rise" style={{ animationDelay: '0.34s' }}>
        <span className="font-din text-xs leading-[16.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">Suggestions</span>
      </div>

      {error ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm" role="alert">
          <span className="text-ink-500">Couldn't load the benefit topics. {error.message}</span>
          <ChipButton onClick={reload}>Try again</ChipButton>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 @max-[640px]:grid-cols-2 @max-[640px]:gap-2.5" aria-busy={loading}>
          {loading
            ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
            : cards.map((t, i) => <SuggestionCard key={t.key} topic={t} index={i} onAsk={onAsk} />)}
        </div>
      )}
    </div>
  );
}

export default function Welcome({ topicsState, compact, composer, onAsk }) {
  const [hello] = useState(greeting);
  const quick = topicsState.data?.quickQuestions ?? [];

  return (
    <section className="absolute inset-0 overflow-x-hidden overflow-y-auto [--hero-h:470px] phone:[--hero-h:600px]">
      {/* FedPoint hero: blue gradient, light bands, and the photo with its wave + aqua swoosh */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-(--hero-h) animate-hero-in overflow-hidden bg-[linear-gradient(180deg,var(--color-blue-dark)_10%,var(--color-blue)_75%,rgba(252,252,252,0)_99%)]"
        aria-hidden="true"
      >
        <div className="hero-bands absolute inset-[-10%_-25%] animate-bands-drift" />
        <img
          src="/assets/hero-visual.webp"
          alt=""
          className={`hero-mask absolute top-0 right-0 h-[clamp(260px,42vh,400px)] w-auto max-w-[72%] origin-[75%_35%] animate-hero-drift object-cover object-right-top narrow:h-[clamp(240px,34vh,340px)] phone:top-[calc(54px+env(safe-area-inset-top))] phone:h-[200px] phone:w-full phone:max-w-none phone:object-[70%_18%] phone:hero-mask-phone ${compact ? 'mid:h-[clamp(240px,34vh,330px)] mid:max-w-[58%]' : ''}`}
        />
      </div>

      <div className="relative z-[1] mx-auto box-content max-w-[912px] px-8 pt-[clamp(52px,9vh,88px)] pb-12 narrow:pt-[90px] phone:px-4 phone:pt-[calc(214px+env(safe-area-inset-top))] phone:pb-[calc(28px+env(safe-area-inset-bottom))]">
        <div className="grid size-[54px] animate-pop-in place-items-center rounded-full bg-white shadow-[0_10px_28px_-10px_rgba(0,16,41,0.6),0_0_0_5px_rgba(148,242,242,0.22)] phone:size-12">
          <BloubFace size={38} mood="suspicious" />
        </div>
        <p className="mt-5 text-sm leading-none font-bold tracking-[0.16em] text-aqua-light uppercase phone:mt-4 phone:text-[12.5px] animate-rise" style={{ animationDelay: '0.12s' }}>
          {hello}
        </p>
        <h1
          className={`mt-3 max-w-[520px] text-[clamp(30px,3vw,44px)] leading-[1.08] font-bold tracking-[-0.01em] text-white [text-shadow:0_2px_20px_rgba(0,16,41,0.25)] phone:mt-2.5 phone:text-[29px] tiny:text-[20px] tiny:leading-[26px] animate-rise ${compact ? 'mid:max-w-[440px] mid:text-[clamp(28px,2.6vw,38px)]' : ''}`}
          style={{ animationDelay: '0.18s' }}
        >
          How can I help with your FedPoint benefits?
        </h1>
        <p className="mt-3.5 max-w-[470px] text-[clamp(16px,1.3vw,19px)] leading-[1.45] text-white/90 phone:mt-2.5 phone:text-[15.5px] animate-rise" style={{ animationDelay: '0.26s' }}>
          Answers come from your 2026 plan documents. No sign-in needed.
        </p>

        <div className="mt-[30px] phone:mt-[22px]">{composer}</div>

        <Suggestions topicsState={topicsState} onAsk={onAsk} />

        {quick.length > 0 && (
          <div
            className="no-scrollbar mt-[18px] flex flex-wrap items-center gap-2 phone:fade-right phone:-mx-4 phone:mt-4 phone:flex-nowrap phone:overflow-x-auto phone:px-4 phone:pb-1 animate-rise"
            style={{ animationDelay: '0.6s' }}
          >
            <span className="mr-1 text-xs leading-[16.5px] font-bold tracking-[0.1em] text-ink-400 uppercase phone:flex-none">Popular</span>
            {quick.map((q, i) => (
              <ChipButton key={q} className={`phone:flex-none phone:whitespace-nowrap ${i === 3 ? 'hidden phone:inline-block' : ''}`} onClick={() => onAsk(q)}>
                {q}
              </ChipButton>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
