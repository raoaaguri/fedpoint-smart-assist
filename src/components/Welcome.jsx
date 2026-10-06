import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import BloubFace from './BloubFace';
import ChipButton from './ChipButton';
import { sfx } from '../utils/sound';


function greeting() {
  const h = new Date().getHours();
  return h < 5 || h >= 17 ? 'Good evening' : h < 12 ? 'Good morning' : 'Good afternoon';
}

function SuggestionCard({ topic, index, onAsk }) {
  return (
    <button
      className="group relative h-[140px] overflow-hidden rounded-xl border border-line bg-white p-0 text-left shadow-card transition-[translate,scale,box-shadow,border-color] duration-400 ease-out-soft [-webkit-tap-highlight-color:transparent] before:absolute before:inset-x-0 before:top-0 before:z-[2] before:h-[3px] before:origin-left before:scale-x-0 before:bg-linear-to-r before:from-aqua before:to-blue before:transition-transform before:duration-450 before:ease-out-soft hover:-translate-y-[3px] hover:border-blue-100 hover:shadow-[0_18px_36px_-16px_rgba(15,23,42,0.2),0_2px_6px_rgba(0,0,0,0.04)] hover:before:scale-x-100 active:scale-[0.97] animate-card-in phone:h-[126px]"
      style={{ animationDelay: `${0.4 + index * 0.07}s` }}
      aria-label={`${topic.title}: ${topic.description}`}
      onClick={() => onAsk(topic.question)}
    >
      <span className="absolute top-[15px] left-4 z-[1] text-[17px] leading-[21px] font-bold whitespace-nowrap text-navy phone:top-[13px] phone:left-3.5 phone:text-[15px]">
        {topic.title}
      </span>
      <span className="absolute top-[39px] left-4 z-[1] line-clamp-2 w-[56%] text-sm leading-[18px] text-ink-500 phone:top-9 phone:left-3.5 phone:w-[60%] phone:text-[12.5px] phone:leading-[17px] tiny:w-[70%]">
        {topic.description}
      </span>
      <span
        className="pointer-events-none absolute -right-2 -bottom-3 h-[88px] w-[132px] animate-float phone:-right-1.5 phone:-bottom-2 phone:h-[68px] phone:w-[102px]"
        style={{ animationDelay: `${-index * 1.1}s` }}
      >
        <img
          src={topic.image}
          alt=""
          draggable="false"
          className="size-full origin-[60%_80%] object-contain transition-transform duration-700 ease-out-soft group-hover:scale-110 group-hover:-rotate-2"
        />
      </span>
    </button>
  );
}

function CardSkeleton() {
  return <div className="h-[140px] animate-pulse rounded-xl border border-line bg-grey-98 phone:h-[126px]" aria-hidden="true" />;
}

function Suggestions({ topicsState, onAsk }) {
  const { data, loading, error, reload } = topicsState;
  const viewport = useRef(null);
  const [page, setPage] = useState(0);

  const pages = data
    ? data.suggestionPages.map((keys) => keys.map((k) => data.topics.find((t) => t.key === k)).filter(Boolean))
    : [];

  // Keep the current page aligned when the window is resized
  useEffect(() => {
    const onResize = () => {
      const v = viewport.current;
      if (v) v.scrollLeft = page * v.clientWidth;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [page]);

  const goPage = (p) => {
    sfx.tap();
    const v = viewport.current;
    const target = Math.max(0, Math.min(pages.length - 1, p));
    v?.scrollTo({ left: target * v.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const v = viewport.current;
    const p = Math.round(v.scrollLeft / Math.max(1, v.clientWidth));
    if (p !== page) setPage(p);
  };

  const arrow = 'grid size-7 place-items-center rounded-md border-2 border-navy bg-white p-0 text-navy transition-[opacity,background-color] enabled:hover:bg-blue-50 disabled:opacity-35';

  return (
    <div className="@container mt-10 phone:mt-[26px]">
      <div className="mb-[10.5px] flex animate-rise items-center justify-between" style={{ animationDelay: '0.34s' }}>
        <span className="text-xs leading-[16.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">Suggestions</span>
        {pages.length > 1 && (
          <span className="flex items-center gap-1.5">
            <span className="mr-1.5 flex items-center gap-[5px]">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goPage(i)}
                  aria-label={`Show suggestions ${i + 1} of ${pages.length}`}
                  aria-current={i === page ? 'true' : undefined}
                  className={`h-1.5 rounded-[3px] border-0 p-0 transition-[width,background-color] duration-350 ease-out-soft ${i === page ? 'w-[18px] bg-navy' : 'w-1.5 bg-[#d1d5db]'}`}
                />
              ))}
            </span>
            <button className={arrow} onClick={() => goPage(page - 1)} disabled={page === 0} aria-label="Previous suggestions">
              <Icon name="chevLeft" size={14} strokeWidth={2.2} />
            </button>
            <button className={arrow} onClick={() => goPage(page + 1)} disabled={page === pages.length - 1} aria-label="More suggestions">
              <Icon name="chev" size={14} strokeWidth={2.2} />
            </button>
          </span>
        )}
      </div>

      {error ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm" role="alert">
          <span className="text-ink-500">Couldn't load the benefit topics. {error.message}</span>
          <ChipButton onClick={reload}>Try again</ChipButton>
        </div>
      ) : (
        <div
          ref={viewport}
          onScroll={onScroll}
          className="no-scrollbar -mx-3 -mt-2 -mb-[22px] flex snap-x snap-mandatory scroll-px-3 gap-6 overflow-x-auto overscroll-x-contain px-3 pt-2 pb-[22px]"
          aria-busy={loading}
        >
          {loading ? (
            <div className="grid flex-[0_0_100%] grid-cols-4 gap-3 @max-[820px]:grid-cols-2 phone:gap-2.5">
              {Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            pages.map((cards, p) => (
              <div key={p} className="grid flex-[0_0_100%] snap-start snap-always grid-cols-4 gap-3 @max-[820px]:grid-cols-2 phone:gap-2.5">
                {cards.map((t, i) => <SuggestionCard key={t.key} topic={t} index={i} onAsk={onAsk} />)}
              </div>
            ))
          )}
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
