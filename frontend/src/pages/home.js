import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import StatusPill from "../components/StatusPill";
import { api } from "../lib/api";

function Hero({ user }) {
  return (
    <section className="grid gap-6 pb-8 pt-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="glass-panel grain-overlay rounded-[2.25rem] border border-white/10 p-8 text-white shadow-[0_28px_80px_-42px_rgba(0,0,0,0.85)]">
        <p className="section-kicker text-amber-300">UI/UX Refresh</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
          A lighter, faster workshop portal for coordinators and instructors.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-stone-300 sm:text-lg">
          The legacy Django app had the right workflows, but the experience was fragmented. This React frontend
          rebuild keeps the core structure intact while making the portal clearer on mobile, easier to scan, and
          simpler to act on.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
          >
            {user ? "Open Dashboard" : "Sign In"}
          </Link>
          <Link
            to={user ? "/propose" : "/register"}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {user ? "Propose Workshop" : "Create Account"}
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {[
          ["Mobile-first navigation", "The important actions are now visible without hunting through templates."],
          ["Cleaner role flows", "Coordinator and instructor journeys now share the same UI language."],
          ["Connected backend", "All core workshop actions use live Django data instead of placeholders."],
        ].map(([title, copy]) => (
          <div key={title} className="glass-panel rounded-[2rem] border border-white/10 p-6 text-stone-100 shadow-xl">
            <h2 className="text-3xl font-semibold leading-none">{title}</h2>
            <p className="mt-2 text-sm text-stone-300">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage({ auth }) {
  const [types, setTypes] = useState([]);
  const [stats, setStats] = useState({ items: [], charts: { by_state: [], by_type: [] } });

  useEffect(() => {
    api.getWorkshopTypes().then((data) => setTypes(data.items));
    api.getPublicStats().then((data) => setStats(data));
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <Hero user={auth.user} />

      <SectionCard
        title="Workshop Catalog"
        subtitle="This is the public workshop-type surface from the Django app, redesigned as a clear mobile-first catalog."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {types.map((type) => (
            <article key={type.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-stone-900">{type.name}</h3>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  {type.duration} day{type.duration > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{type.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone-400">Terms preview</p>
              <p className="mt-2 max-h-24 overflow-hidden text-sm text-stone-500">{type.terms_and_conditions}</p>
            </article>
          ))}
          {types.length === 0 ? <p className="text-sm text-stone-500">No workshop types are configured yet.</p> : null}
        </div>
      </SectionCard>

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title="Public Activity Snapshot"
          subtitle="Accepted workshops and how they’re distributed across states and workshop types."
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">By State</p>
              <div className="mt-3 space-y-3">
                {stats.charts.by_state.map((entry) => (
                  <div key={entry.label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-stone-600">
                      <span>{entry.label}</span>
                      <span>{entry.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100">
                      <div className="h-2 rounded-full bg-amber-400" style={{ width: `${Math.min(entry.value * 20, 100)}%` }} />
                    </div>
                  </div>
                ))}
                {stats.charts.by_state.length === 0 ? <p className="text-sm text-stone-500">No accepted workshops yet.</p> : null}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">By Workshop Type</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.charts.by_type.map((entry) => (
                  <span key={entry.label} className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700">
                    {entry.label} · {entry.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Accepted Workshops"
          subtitle="A slimmed-down public snapshot of the backend statistics page."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-stone-500">
                <tr className="border-b border-stone-200">
                  <th className="pb-3">Workshop</th>
                  <th className="pb-3">Coordinator</th>
                  <th className="pb-3">State</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.items.slice(0, 6).map((workshop) => (
                  <tr key={workshop.id} className="border-b border-stone-100">
                    <td className="py-3 text-stone-900">{workshop.workshop_type.name}</td>
                    <td className="py-3 text-stone-600">{workshop.coordinator.name}</td>
                    <td className="py-3 text-stone-600">{workshop.coordinator.state_label}</td>
                    <td className="py-3 text-stone-600">{workshop.date}</td>
                    <td className="py-3">
                      <StatusPill label={workshop.status_label} />
                    </td>
                  </tr>
                ))}
                {stats.items.length === 0 ? (
                  <tr>
                    <td className="py-6 text-stone-500" colSpan="5">
                      No accepted workshops to show yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
