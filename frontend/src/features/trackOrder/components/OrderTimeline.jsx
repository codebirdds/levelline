const STEPS = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const rank = Object.fromEntries(STEPS.map((step, index) => [step.key, index]));

export default function OrderTimeline({ status }) {
  const currentRank = rank[status] ?? 0;

  return (
    <div className="w-full py-2">
      <div className="relative flex w-full justify-between">
        
        {/* Background Line */}
        <div className="absolute left-0 top-[10px] h-[2px] w-full -translate-y-1/2 bg-gray-200" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-[10px] h-[2px] -translate-y-1/2 bg-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: `${(currentRank / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentRank;
          const isActive = index === currentRank;
          
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`flex size-5 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300 ${
                  isCompleted ? "border-emerald-500" : "border-gray-300"
                }`}
              >
                {isCompleted && <div className="size-2.5 rounded-full bg-emerald-500" />}
              </div>
              
              <span 
                className={`mt-2 whitespace-nowrap text-[9px] font-medium sm:text-[10px] ${
                  isActive 
                    ? "text-emerald-700 font-bold" 
                    : isCompleted 
                    ? "text-[#414141]" 
                    : "text-[#808080]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}