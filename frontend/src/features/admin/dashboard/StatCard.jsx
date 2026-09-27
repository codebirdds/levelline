export default function StatCard({ label, value, hint, tone = "brand" }) {
  const tones = {
    brand:  "bg-brand-soft text-brand",
    accent: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-danger",
    ink:    "bg-slate-100 text-ink",
  };
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-md grid place-items-center ${tones[tone]}`}>
        <span className="w-2 h-2 rounded-full bg-current" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-ink mt-1">{value}</p>
        {hint && <p className="text-xs text-subtle mt-1">{hint}</p>}
      </div>
    </div>
  );
}