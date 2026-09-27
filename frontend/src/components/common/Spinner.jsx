export default function Spinner({ full }) {
  return (
    <div className={full ? "grid place-items-center py-24" : "inline-block"}>
      <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
    </div>
  );
}