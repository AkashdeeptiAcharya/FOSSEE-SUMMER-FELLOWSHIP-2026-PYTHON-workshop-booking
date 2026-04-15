import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { api } from "../lib/api";

export default function ProfilePage({ auth }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    title: "",
    institute: "",
    department: "",
    phone_number: "",
    location: "",
    state: "",
  });
  const [notice, setNotice] = useState("");
  const meta = auth.meta || { titles: [], departments: [], states: [] };

  useEffect(() => {
    api.getProfile().then((data) => {
      const profile = data.profile;
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.profile?.title || "",
        institute: profile.profile?.institute || "",
        department: profile.profile?.department || "",
        phone_number: profile.profile?.phone_number || "",
        location: profile.profile?.location || "",
        state: profile.profile?.state || "",
      });
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await api.updateProfile(form);
    auth.setSession((current) => ({
      ...current,
      user: {
        ...current.user,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
      },
    }));
    setNotice("Profile updated.");
  }

  return (
    <div className="mx-auto max-w-4xl pb-10 pt-4">
      <SectionCard
        title="Your profile"
        subtitle="This covers the editable self-profile view from the Django app."
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">First name</span>
            <input value={form.first_name} onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Last name</span>
            <input value={form.last_name} onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Title</span>
            <select value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900">
              <option value="">Select title</option>
              {meta.titles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Institute</span>
            <input value={form.institute} onChange={(event) => setForm((current) => ({ ...current, institute: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Department</span>
            <select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900">
              <option value="">Select department</option>
              {meta.departments.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Phone number</span>
            <input value={form.phone_number} onChange={(event) => setForm((current) => ({ ...current, phone_number: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">Location</span>
            <input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-700">State</span>
            <select value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none text-stone-900">
              <option value="">Select state</option>
              {meta.states.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            {notice ? <p className="mb-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p> : null}
            <button type="submit" className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white">
              Save profile
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
