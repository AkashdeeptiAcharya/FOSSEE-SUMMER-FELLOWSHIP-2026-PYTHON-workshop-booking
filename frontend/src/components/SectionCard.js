export default function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`paper-panel rounded-[2rem] border border-stone-200/80 p-6 sm:p-7 ${className}`}>
      <div className="mb-5 flex flex-col gap-3 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold leading-none text-stone-900">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
