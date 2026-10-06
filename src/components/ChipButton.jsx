export default function ChipButton({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded-md border-[1.5px] border-blue-100 bg-white px-3.5 py-[7px] text-left text-sm leading-[18px] font-medium text-navy transition-colors enabled:hover:border-navy enabled:hover:bg-blue-50 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
