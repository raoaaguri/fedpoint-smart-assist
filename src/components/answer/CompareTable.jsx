import RichText from './RichText';

const cellPad = 'px-3.5 py-2.5 phone:px-[11px] phone:py-[9px]';

function Cell({ cell, tier }) {
  if (typeof cell === 'string') return <RichText text={cell} />;
  if (cell.type === 'byTier') {
    return tier
      ? <><mark className="rounded px-[3px] font-bold bg-mark text-mark-ink">{cell.values[tier]}</mark> for {tier.toLowerCase()} {cell.suffix}</>
      : <RichText text={cell.fallback} />;
  }
  if (cell.style === 'soon') {
    return <span className="inline-block rounded-full bg-grey-96 px-[9px] py-0.5 text-xs text-ink-500">{cell.text}</span>;
  }
  return <RichText text={cell.text} />;
}

export default function CompareTable({ columns, rows, rowHeader, tier }) {
  return (
    <div className="mt-1 mb-3.5 overflow-x-auto rounded-[14px] border border-line bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <table className="w-full border-collapse text-[13.5px] leading-normal phone:text-[13px]">
        <thead>
          <tr>
            <th className={`border-b border-blue-100 bg-blue-50 text-left align-bottom text-sm leading-[1.35] font-bold text-navy ${cellPad}`}>{rowHeader}</th>
            {columns.map((c) => (
              <th key={c.title} className="border-b border-blue-100 bg-blue-50 px-3.5 py-3 text-left align-bottom text-sm leading-[1.35] font-bold text-navy phone:px-[11px] phone:py-[9px]">
                {c.title}
                {c.subtitle && <small className="mt-0.5 block text-xs leading-[1.4] font-normal text-ink-500">{c.subtitle}</small>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => {
            const border = ri > 0 ? 'border-t border-line-soft' : '';
            // A section row spans the whole table, like "Frames every 12 months:"
            if (r.section) {
              return (
                <tr key={ri}>
                  <th scope="colgroup" colSpan={columns.length + 1} className={`bg-grey-98 text-left font-bold text-navy ${cellPad} ${border}`}>{r.section}</th>
                </tr>
              );
            }
            return (
              <tr key={ri}>
                <th scope="row" className={`w-[30%] text-left align-top font-medium text-ink-600 ${cellPad} ${border}`}>{r.label}</th>
                {r.cells.map((cell, ci) => (
                  <td key={ci} className={`align-top text-ink-800 ${cellPad} ${border}`}>
                    <Cell cell={cell} tier={tier} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
