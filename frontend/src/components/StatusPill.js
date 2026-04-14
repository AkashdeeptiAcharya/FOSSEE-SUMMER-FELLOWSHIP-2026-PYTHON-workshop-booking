const styles = {
  Pending: "border border-amber-200 bg-amber-100/90 text-amber-800",
  Accepted: "border border-emerald-200 bg-emerald-100/90 text-emerald-800",
  Deleted: "border border-rose-200 bg-rose-100/90 text-rose-800",
};

export default function StatusPill({ label }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        styles[label] || "border border-stone-200 bg-stone-100 text-stone-700"
      }`}
    >
      {label}
    </span>
  );
}
