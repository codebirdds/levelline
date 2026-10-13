export default function Input({ label, error, className = "", icon: Icon, Click=()=>{}, ...rest }) {
  return (
    <label className="relative block">
      {label && (
        <span className="block mb-1 text-sm font-medium text-ink">{label}</span>
      )}
      <input
        className={`  w-full border border-[var(--color-border)] rounded px-3 py-2 outline-none focus:border-brand ${className}`}
        {...rest}
      />
      {Icon && (
        <span className="absolute right-3 top-[35px]  text-gray-400" onClick={Click}>
          <Icon />
        </span>
      )}
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  );
}