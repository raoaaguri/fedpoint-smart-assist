import Icon from '../Icon';
import RichText from './RichText';
import CompareTable from './CompareTable';
import CostCalculator from './CostCalculator';

function Facts({ items, labelSuffix = ':' }) {
  return (
    <ul className="mt-1 mb-3.5 grid list-none gap-[9px] p-0">
      {items.map((f, i) => (
        <li key={i} className="grid grid-cols-[20px_minmax(0,1fr)] items-start gap-2.5">
          <span className="mt-[3px] grid size-5 place-items-center rounded-full bg-aqua-lightest text-aqua-vivid">
            <Icon name="check" size={13} strokeWidth={2.4} />
          </span>
          <span><strong className="font-bold text-navy">{f.label}{labelSuffix}</strong> <RichText text={f.text} /></span>
        </li>
      ))}
    </ul>
  );
}

function Note({ icon, text }) {
  return (
    <div className="mt-1.5 mb-3 flex items-start gap-2.5 rounded-[10px] border border-blue-100 bg-blue-50 px-3.5 py-[11px] text-[15px] leading-[1.55] text-ink-700">
      <Icon name={icon} className="mt-0.5 text-blue-vivid" />
      <span><RichText text={text} /></span>
    </div>
  );
}

function People({ items }) {
  return (
    <div className="mt-1 mb-3 grid gap-2">
      {items.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-[11px] phone:flex-col phone:items-start phone:gap-2">
          <div>
            <b className="block text-sm leading-[1.4] font-semibold text-ink-900">{p.name}</b>
            <span className="text-[12.5px] text-ink-500">{p.description}</span>
          </div>
          <a
            href={`tel:${p.tel}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[13px] leading-[1.3] font-medium whitespace-nowrap text-blue-vivid no-underline transition-colors hover:bg-[#e0edfd]"
          >
            <Icon name="phone" size={14} />{p.phone}
          </a>
        </div>
      ))}
    </div>
  );
}

export function NotedTag({ label }) {
  return (
    <div className="mb-2.5 inline-flex items-center gap-[7px] rounded-full bg-aqua-lightest py-1 pr-[11px] pl-[9px] text-[13px] leading-[18px] font-semibold text-aqua-darker">
      <Icon name="check" size={13} strokeWidth={2.4} />
      <span>Using what you told me: {label}</span>
    </div>
  );
}

// Renders the `blocks` array of an Answer returned by the API.
export default function AnswerBlocks({ blocks, tier }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'paragraph':
        return <p key={i} className="mb-3"><RichText text={b.text} /></p>;
      case 'table':
        return <CompareTable key={i} columns={b.columns} rows={b.rows} rowHeader={b.rowHeader} tier={tier} />;
      case 'facts':
        return <Facts key={i} items={b.items} labelSuffix={b.labelSuffix} />;
      case 'note':
        return <Note key={i} icon={b.icon} text={b.text} />;
      case 'calculator':
        return <CostCalculator key={i} block={b} />;
      case 'people':
        return <People key={i} items={b.items} />;
      default:
        return null; // unknown block types from the backend are skipped
    }
  });
}
