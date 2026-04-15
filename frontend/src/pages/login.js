import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import { api } from "../lib/api";

export default function LoginPage({ auth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const data = await api.login(form);
      auth.setSession((current) => ({ ...current, user: data.user }));
      navigate("/dashboard");
    } catch (requestError) {
      if (requestError.payload?.requires_activation) {
        setMessage(requestError.payload?.message || "Please activate your account before signing in.");
      } else {
        setError(requestError.payload?.message || "Unable to sign in.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 pb-10 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-panel grain-overlay rounded-[2.25rem] border border-white/10 p-8 text-white shadow-[0_28px_80px_-42px_rgba(0,0,0,0.85)]">
        <p className="section-kicker text-amber-300">Sign In</p>
        <h1 className="mt-4 text-5xl font-semibold leading-[0.95]">Manage workshops without the old template friction.</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-stone-500">
          Booking, scheduling, and tracking workshops has never been easier. Our portal gives you a clear view of all your workshop activities, so you can focus on what matters most.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-700">Coordinator</p>
            <p className="mt-3 text-lg font-semibold text-stone-700">Track proposals and status changes without getting lost.</p>
            <p className="mt-2 text-sm text-stone-500">Same workflow, calmer hierarchy.</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-700">Instructor</p>
            <p className="mt-3 text-lg font-semibold text-stone-700">Review requests, accept workshops, and respond faster.</p>
            <p className="mt-2 text-sm text-stone-500">Everything important is easier to find.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-stone-600">
          <span className="rounded-full border border-white/10 px-3 py-2">Easy-to-use</span>
          <span className="rounded-full border border-white/10 px-3 py-2">Hassle-free</span>
          <span className="rounded-full border border-white/10 px-3 py-2">Works on Mobile Devices</span>
        </div>
      </div>

      <SectionCard
        title="Welcome back"
        subtitle="Use your username and password to enter the same core system through a clearer interface."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-stone-600">Username</span>
            <input
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              className="input-shell w-full"
              placeholder="jane.coord"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-stone-600">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="input-shell w-full"
              placeholder="Enter your password"
            />
          </label>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3 border-t border-stone-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            Need an account?{" "}
            <Link to="/register" className="font-semibold text-sky-700">
              Create one here
            </Link>
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">AN IIT BOMBAY INITIATIVE</p>
        </div>
      </SectionCard>
    </div>
  );
}

