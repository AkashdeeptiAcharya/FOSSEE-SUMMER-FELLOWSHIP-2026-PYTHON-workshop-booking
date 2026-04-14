import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import { api } from "../lib/api";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  title: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  institute: "",
  department: "",
  location: "",
  state: "",
  how_did_you_hear_about_us: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-stone-600">{label}</span>
      {children}
    </label>
  );
}

export default function RegisterPage({ auth }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const meta = useMemo(
    () =>
      auth.meta || {
        titles: [],
        departments: [],
        states: [],
        sources: [],
      },
    [auth.meta]
  );

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const data = await api.register(form);
      setMessage(data.message);
    } catch (requestError) {
      const payloadErrors = requestError.payload?.errors;
      if (payloadErrors) {
        const firstField = Object.keys(payloadErrors)[0];
        const firstMessage = payloadErrors[firstField]?.[0]?.message;
        setError(firstMessage || requestError.payload?.message || "Unable to register.");
      } else {
        setError(requestError.payload?.message || "Unable to register.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 pb-10 pt-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="glass-panel grain-overlay rounded-[2.25rem] border border-white/10 p-8 text-white shadow-[0_28px_80px_-42px_rgba(0,0,0,0.85)]">
        <p className="section-kicker text-amber-300">Registration</p>
        <h1 className="mt-4 text-5xl font-semibold leading-[0.95]">Bring the full Django coordinator form into a friendlier React flow.</h1>
        <p className="mt-5 text-sm leading-7 text-stone-300">
          The original registration page rendered a large table-based form. This version keeps the same required
          backend fields, but turns them into a readable, mobile-first layout with clearer grouping and better input rhythm.
        </p>
        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">What changed</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-300">
            <li>Full coordinator registration fields are preserved.</li>
            <li>Inputs are grouped to reduce scrolling confusion on mobile.</li>
            <li>The form submits directly to Django instead of staying a static mock.</li>
          </ul>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Core structure</p>
            <p className="mt-2 text-base font-semibold">Same data model, same validation, cleaner presentation.</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Mobile first</p>
            <p className="mt-2 text-base font-semibold">Shorter scan paths and better rhythm across long forms.</p>
          </div>
        </div>
      </div>

      <SectionCard
        title="Create account"
        subtitle="This maps to the backend registration form and session flow, but with clearer grouping and a more guided feel."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2 rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Identity</p>
            <p className="mt-2 text-sm text-amber-900">Start with the account and contact information Django already requires.</p>
          </div>
          <Field label="Username">
            <input value={form.username} onChange={(event) => updateField("username", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="Title">
            <select value={form.title} onChange={(event) => updateField("title", event.target.value)} className="input-shell w-full">
              <option value="">Select title</option>
              {meta.titles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone number">
            <input value={form.phone_number} onChange={(event) => updateField("phone_number", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="First name">
            <input value={form.first_name} onChange={(event) => updateField("first_name", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="Last name">
            <input value={form.last_name} onChange={(event) => updateField("last_name", event.target.value)} className="input-shell w-full" />
          </Field>
          <div className="md:col-span-2 mt-2 rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700">Institution</p>
            <p className="mt-2 text-sm text-sky-900">These fields match the coordinator profile stored in the legacy app.</p>
          </div>
          <Field label="Institute">
            <input value={form.institute} onChange={(event) => updateField("institute", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="Department">
            <select value={form.department} onChange={(event) => updateField("department", event.target.value)} className="input-shell w-full">
              <option value="">Select department</option>
              {meta.departments.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={(event) => updateField("location", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="State">
            <select value={form.state} onChange={(event) => updateField("state", event.target.value)} className="input-shell w-full">
              <option value="">Select state</option>
              {meta.states.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="How did you hear about us?">
            <select
              value={form.how_did_you_hear_about_us}
              onChange={(event) => updateField("how_did_you_hear_about_us", event.target.value)}
              className="input-shell w-full"
            >
              <option value="">Select an option</option>
              {meta.sources.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2 mt-2 rounded-[1.75rem] border border-stone-200 bg-stone-50/90 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Security</p>
            <p className="mt-2 text-sm text-stone-700">Finish by setting the password used by Django authentication.</p>
          </div>
          <Field label="Password">
            <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className="input-shell w-full" />
          </Field>
          <Field label="Confirm password">
            <input type="password" value={form.confirm_password} onChange={(event) => updateField("confirm_password", event.target.value)} className="input-shell w-full" />
          </Field>
          <div className="md:col-span-2">
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            {message ? <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</p> : null}
          </div>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-sky-700">
                Login here
              </Link>
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
