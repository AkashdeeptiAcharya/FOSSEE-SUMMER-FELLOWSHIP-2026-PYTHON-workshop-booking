import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PublicStats() {
  const [stats, setStats] = useState({
    stateCounts: [],
    typeCounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await axios.get("/api/public-stats/");
        if (!response.data.ok) {
          throw new Error(response.data.message || "Failed to load public stats");
        }

        const payload = response.data.data || response.data;
        setStats({
          stateCounts: payload.workshops_by_state || payload.state_counts || [],
          typeCounts: payload.workshops_by_type || payload.type_counts || [],
        });
      } catch (err) {
        setError("Unable to load public statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <div>Loading public statistics...</div>;
  if (error) return <div className="text-rose-700">{error}</div>;

  const totalTypeCount = stats.typeCounts.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="space-y-8 pb-10 pt-4 text-stone-950">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-stone-950">Public Workshop Statistics</h1>
        <p className="max-w-2xl text-sm text-stone-600">
          Open statistics for all users: workshop coverage by state and workshop type distribution.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-950">Workshop Map</h2>
          <div className="mt-5 rounded-3xl border border-stone-200 bg-slate-50 p-8 text-center">
            <div className="mx-auto mb-4 h-48 w-full max-w-md rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_50%)]">
              <p className="mt-20 text-sm text-stone-500">Map of India visualization placeholder.</p>
            </div>
            <div className="space-y-3">
              {stats.stateCounts.length === 0 ? (
                <p className="text-sm text-stone-500">No state-level data available.</p>
              ) : (
                stats.stateCounts.map((item) => (
                  <div key={item.state} className="flex justify-between text-sm text-stone-700">
                    <span>{item.state}</span>
                    <span>{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-950">Workshops by type</h2>
          <div className="mt-5 space-y-4">
            {stats.typeCounts.length === 0 ? (
              <p className="text-sm text-stone-500">No workshop type data available.</p>
            ) : (
              stats.typeCounts.map((item) => {
                const count = item.count || 0;
                const percent = totalTypeCount ? Math.round((count / totalTypeCount) * 100) : 0;
                return (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-stone-700">
                      <span>{item.type}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-sky-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}