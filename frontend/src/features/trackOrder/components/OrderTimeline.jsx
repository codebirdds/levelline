const STEPS = [
  { key: "pending", label: "Order placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const rank = Object.fromEntries(STEPS.map((step, index) => [step.key, index]));

export default function OrderTimeline({ status }) {
  if (status === "cancelled" || status === "returned") {
    return <div className="border-l-2 border-[#c0392b] pl-4"><p className="font-medium capitalize text-[#c0392b]">Order {status}</p><p className="mt-1 text-xs text-[#808080]">This order is no longer progressing through delivery.</p></div>;
  }

  const current = rank[status] ?? 0;
  return (
    <ol className="space-y-3" aria-label="Order progress">
      {STEPS.map((step, index) => {
        const complete = index <= current;
        return <li key={step.key} className="flex items-center gap-3">
          <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${complete ? "border-[#2f8f3e] bg-[#2f8f3e] text-white" : "border-border text-transparent"}`} aria-hidden="true">✓</span>
          <span className={`text-sm ${complete ? "font-medium text-[#414141]" : "text-[#9a9a9a]"}`}>{step.label}</span>
        </li>;
      })}
    </ol>
  );
}
