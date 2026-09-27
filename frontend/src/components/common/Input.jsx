export default function Input({ label, error, className = "", ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block mb-1 text-sm font-medium text-ink">{label}</span>
      )}
      <input
        className={`w-full border border-[var(--color-border)] rounded px-3 py-2 outline-none focus:border-brand ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  );
}