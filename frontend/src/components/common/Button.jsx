export default function Button({
  children, loading, variant = "primary", className = "", ...rest
}) {
  const base =
    "inline-flex items-center justify-center rounded font-semibold px-5 py-2.5 transition disabled:opacity-60";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    ghost:   "bg-white text-ink border border-[var(--color-border)] hover:border-brand",
    danger:  "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}