import { useState } from 'react';

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');

// "Estimate your share" card. All rates and limits come from the API block.
export default function CostCalculator({ block }) {
  const { title, hint, deductible, annualMax, fields, planLabel, youLabel, defaultNote, maxNote } = block;
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.key, String(f.defaultValue)])));

  let raw = 0;
  let total = 0;
  for (const f of fields) {
    const v = Math.max(0, +values[f.key] || 0);
    total += v;
    raw += Math.max(0, v - (f.applyDeductible ? deductible : 0)) * f.coinsurance;
  }
  const plan = Math.min(raw, annualMax);
  const you = total - plan;
  const pct = total ? (plan / total) * 100 : 0;
  const note = raw > annualMax ? maxNote.replace('{max}', '$' + annualMax.toLocaleString('en-US')) : defaultNote;

  return (
    <div className="mt-1 mb-3.5 rounded-2xl border border-line bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-1 text-sm leading-[1.4] font-semibold text-ink-900">
        {title} <span className="text-xs font-normal text-ink-500">{hint}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 phone:grid-cols-1">
        {fields.map((f) => (
          <label key={f.key}>
            <span className="mb-1.5 block text-xs leading-[1.4] font-medium text-ink-500">{f.label}</span>
            <div className="flex h-[38px] items-center gap-1 rounded-[10px] border border-line px-3 transition-[border-color,box-shadow] duration-200 focus-within:border-blue focus-within:shadow-[0_0_0_3px_rgba(148,242,242,0.35)]">
              <span className="text-ink-400">$</span>
              <input
                type="number"
                min="0"
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                aria-label={f.ariaLabel}
                className="no-spin min-w-0 flex-1 border-0 bg-transparent text-[14.5px] leading-none font-medium text-ink-900 outline-0 focus-visible:outline-none"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 mb-3 flex h-2.5 overflow-hidden rounded-full bg-grey-96" aria-hidden="true">
        <div className="bg-blue transition-[width] duration-500 ease-out-soft" style={{ width: `${pct}%` }} />
        <div className="bg-orange transition-[width] duration-500 ease-out-soft" style={{ width: `${total ? 100 - pct : 0}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-3 phone:grid-cols-1">
        <div>
          <small className="flex items-center gap-1.5 text-xs leading-[1.4] text-ink-500 before:size-2 before:rounded-full before:bg-blue">{planLabel}</small>
          <b className="text-[23px] leading-[1.3] font-bold text-navy">{fmt(plan)}</b>
        </div>
        <div>
          <small className="flex items-center gap-1.5 text-xs leading-[1.4] text-ink-500 before:size-2 before:rounded-full before:bg-orange">{youLabel}</small>
          <b className="text-[23px] leading-[1.3] font-bold text-navy">{fmt(you)}</b>
        </div>
      </div>

      <div className="mt-2.5 text-xs leading-normal text-ink-500">{note}</div>
    </div>
  );
}
