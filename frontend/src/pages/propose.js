import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import { api } from "../lib/api";

export default function ProposeWorkshopPage({ auth }) {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ workshop_type: "", date: "", tnc_accepted: false });
  const [error, setError] = useState("");

  useEffect(() => {
    api.getWorkshopTypes().then((data) => setTypes(data.items));
  }, []);

  if (auth.user.role !== "coordinator") {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.proposeWorkshop(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.payload?.message || "Unable to propose workshop.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10 pt-4">
      <SectionCard
        title="Propose a workshop"
        subtitle="This replaces the old coordinator proposal template with a cleaner submission flow."
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Workshop type</span>
            <select
              value={form.workshop_type}
              onChange={(event) => setForm((current) => ({ ...current, workshop_type: event.target.value }))}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none focus:border-sky-400"
            >
              <option value="">Select workshop</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Preferred date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-stone-900 outline-none focus:border-sky-400"
            />
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4">
            <input
              type="checkbox"
              checked={form.tnc_accepted}
              onChange={(event) => setForm((current) => ({ ...current, tnc_accepted: event.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-stone-300"
            />
            <span className="text-sm text-stone-600">
              I accept the workshop terms and conditions. This is required by the existing Django model.
            </span>
          </label>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <button type="submit" className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white">
            Submit proposal
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
