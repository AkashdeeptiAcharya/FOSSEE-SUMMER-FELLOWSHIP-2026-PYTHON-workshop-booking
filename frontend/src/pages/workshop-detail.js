import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import StatusPill from "../components/StatusPill";
import { api } from "../lib/api";

export default function WorkshopDetailPage({ auth }) {
  const { workshopId } = useParams();
  const [data, setData] = useState({ item: null, comments: [] });
  const [comment, setComment] = useState({ comment: "", public: auth.user.role !== "instructor" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkshop() {
      try {
        const response = await api.getWorkshop(workshopId);
        setData(response);
      } catch (requestError) {
        setError(requestError.payload?.message || "Unable to load workshop details.");
      }
    }

    loadWorkshop();
  }, [workshopId]);

  async function handleComment(event) {
    event.preventDefault();
    try {
      await api.addComment(workshopId, comment);
      setComment({ comment: "", public: auth.user.role !== "instructor" });
      const response = await api.getWorkshop(workshopId);
      setData(response);
    } catch (requestError) {
      setError(requestError.payload?.message || "Unable to post comment.");
    }
  }

  if (!data.item) {
    return <div className="py-10 text-center text-stone-500">{error || "Loading workshop..."}</div>;
  }

  const workshop = data.item;

  return (
    <div className="grid gap-8 pb-10 pt-4 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title={workshop.workshop_type.name} subtitle="Workshop details, comments, and role-specific context.">
        <div className="space-y-4 text-sm text-stone-600">
          <div className="flex items-center gap-3">
            <StatusPill label={workshop.status_label} />
            <span>{workshop.date}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Coordinator</p>
            <p className="mt-2 text-base text-stone-900">{workshop.coordinator.name}</p>
            <p>{workshop.coordinator.institute}</p>
            <p>{workshop.coordinator.state_label}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Instructor</p>
            <p className="mt-2 text-base text-stone-900">{workshop.instructor?.name || "Unassigned"}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Discussion" subtitle="Comments are connected to the backend workshop detail view.">
        <form className="space-y-4" onSubmit={handleComment}>
          <textarea
            value={comment.comment}
            onChange={(event) => setComment((current) => ({ ...current, comment: event.target.value }))}
            rows="5"
            className="w-full rounded-[1.5rem] border border-stone-200 px-4 py-3 outline-none focus:border-sky-400"
            placeholder="Leave a workshop note or coordination comment"
          />
          {auth.user.role === "instructor" ? (
            <label className="flex items-center gap-3 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={comment.public}
                onChange={(event) => setComment((current) => ({ ...current, public: event.target.checked }))}
              />
              Make this comment public
            </label>
          ) : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <button type="submit" className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white">
            Post comment
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {data.comments.map((entry) => (
            <article key={entry.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-stone-900">{entry.author}</p>
                <span className="text-xs uppercase tracking-[0.25em] text-stone-400">
                  {entry.public ? "Public" : "Private"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{entry.comment}</p>
            </article>
          ))}
          {data.comments.length === 0 ? <p className="text-sm text-stone-500">No comments yet.</p> : null}
        </div>
      </SectionCard>
    </div>
  );
}
