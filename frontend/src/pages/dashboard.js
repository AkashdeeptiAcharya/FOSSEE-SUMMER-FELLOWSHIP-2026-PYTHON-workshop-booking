import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import StatusPill from "../components/StatusPill";
import { api } from "../lib/api";

function SummaryCard({ label, value, tone }) {
  return (
    <div className={`paper-panel rounded-[1.9rem] border border-stone-200/80 p-5 ${tone}`}>
      <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}

export default function DashboardPage({ auth }) {
  const [data, setData] = useState({ items: [], summary: { total: 0, pending: 0, accepted: 0, upcoming: 0 } });
  const [query, setQuery] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState({});
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const response = await api.getDashboard();
      setData(response);
    } catch (requestError) {
      setError(requestError.payload?.message || "Unable to load dashboard.");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const workshops = useMemo(() => {
    return data.items.filter((item) => {
      const needle = query.toLowerCase();
      return (
        item.workshop_type.name.toLowerCase().includes(needle) ||
        item.coordinator.name.toLowerCase().includes(needle) ||
        item.coordinator.state_label.toLowerCase().includes(needle)
      );
    });
  }, [data.items, query]);

  async function handleAccept(workshopId) {
    await api.acceptWorkshop(workshopId);
    await loadDashboard();
  }

  async function handleReschedule(workshopId) {
    const date = rescheduleDate[workshopId];
    if (!date) {
      return;
    }
    await api.changeWorkshopDate(workshopId, date);
    await loadDashboard();
  }

  return (
    <div className="space-y-8 pb-10 pt-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total workshops" value={data.summary.total} tone="bg-amber-50" />
        <SummaryCard label="Pending" value={data.summary.pending} tone="bg-rose-50" />
        <SummaryCard label="Accepted" value={data.summary.accepted} tone="bg-emerald-50" />
        <SummaryCard label="Upcoming" value={data.summary.upcoming} tone="bg-sky-50" />
      </section>

      <SectionCard
        title={`${auth.user.role === "instructor" ? "Instructor" : "Coordinator"} dashboard`}
        subtitle="This covers the legacy status pages and turns them into one responsive dashboard."
        action={
          auth.user.role === "coordinator" ? (
            <Link to="/propose" className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
              Propose workshop
            </Link>
          ) : null
        }
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by workshop, coordinator, or state"
            className="input-shell w-full sm:max-w-md"
          />
          <p className="text-sm text-stone-500">
            Showing {workshops.length} of {data.items.length} workshop{data.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {error ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr className="border-b border-stone-200">
                <th className="pb-3">Workshop</th>
                <th className="pb-3">Coordinator</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((workshop) => (
                <tr key={workshop.id} className="border-b border-stone-100 align-top">
                  <td className="py-4">
                    <p className="font-medium text-stone-900">{workshop.workshop_type.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-stone-400">UID {workshop.uid.slice(0, 8)}</p>
                  </td>
                  <td className="py-4 text-stone-600">{workshop.coordinator.name}</td>
                  <td className="py-4 text-stone-600">{workshop.coordinator.state_label}</td>
                  <td className="py-4 text-stone-600">{workshop.date}</td>
                  <td className="py-4">
                    <StatusPill label={workshop.status_label} />
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-2">
                      <Link to={`/workshops/${workshop.id}`} className="text-sm font-semibold text-sky-700 underline-offset-4 hover:underline">
                        View details
                      </Link>
                      {auth.user.role === "instructor" && workshop.status === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAccept(workshop.id)}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                        >
                          Accept workshop
                        </button>
                      ) : null}
                      {auth.user.role === "instructor" ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="date"
                            value={rescheduleDate[workshop.id] || ""}
                            onChange={(event) =>
                              setRescheduleDate((current) => ({ ...current, [workshop.id]: event.target.value }))
                            }
                            className="input-shell rounded-full px-3 py-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleReschedule(workshop.id)}
                            className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700"
                          >
                            Change date
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {workshops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No workshops match the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
