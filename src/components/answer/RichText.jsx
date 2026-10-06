// Renders API text: **bold** and ==highlight== become styled spans, \n a line break.
// No raw HTML is injected.
const INLINE = /(\*\*[^*]+\*\*|==[^=]+==|\n)/g;

export default function RichText({ text }) {
  return text.split(INLINE).map((part, i) => {
    if (part === '\n') return <br key={i} />;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-bold text-navy">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('==') && part.endsWith('==') && part.length > 4) {
      return <mark key={i} className="rounded px-[3px] font-bold bg-mark text-mark-ink">{part.slice(2, -2)}</mark>;
    }
    return part;
  });
}
