// Mock-only: decides which answer file a free-text question maps to.
// Ported unchanged from the HTML prototype's route(). The real backend replaces this.
export function matchAnswer(text) {
  const t = text.toLowerCase();
  if (/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/.test(t)) return 'privacy';
  if (t === 'something changed in my life') return 'life-change';
  if (t === 'help me choose a medical plan') return 'medical-tier';
  if (t === "what's covered for dental and vision?") return 'dental-vision';
  if (['just me', 'me + spouse', 'me + children', 'family'].includes(t)) return 'medical-care';
  if (/(talk|speak).*(person|human|someone|agent)|contact|phone number|call (someone|cigna|delta)|\bhuman\b/.test(t)) return 'contacts';
  if (/baby|newborn|birth|adopt|married|marriage|wedding|lost .*coverage|losing .*coverage|life event|qualifying/.test(t)) return 'life-event';
  if (/dental|dentist|root canal|crown|tooth|teeth|braces|ortho|double-up|cleaning|delta dental/.test(t)) return 'dental';
  if (/vision|glasses|contacts|eye|lasik|frames|lens/.test(t)) return 'vision';
  if (/disab|\bstd\b|\bltd\b|income protection/.test(t)) return 'disability';
  if (/life insur|ad&d|\badd\b|term life|beneficiar/.test(t)) return 'life';
  if (/legal|attorney|lawyer|\bwill\b|estate/.test(t) && !/financial/.test(t)) return 'legal';
  if (/financial plan|planner|\$400|reimburse/.test(t)) return 'financial';
  if (/\bfsa\b|\bhsa\b|\bhra\b|spending account|flexible spending|health savings/.test(t)) return 'accounts';
  if (/medical|health plan|deductible|hdhp|\boap\b|cigna|compare|premium|doctor|prescription|out-of-pocket/.test(t)) return 'medical';
  return 'off-topic';
}
