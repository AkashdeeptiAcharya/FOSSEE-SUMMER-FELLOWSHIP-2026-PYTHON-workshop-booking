import React, { useState, useEffect } from "react";
import axios from "axios";

const InstructorStats = ({ auth }) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    upcoming: 0,
  });
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchComments();
  }, []);

  const [newComment, setNewComment] = useState("");

  const handlePostComment = async (coordinatorId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`/api/comments/`, {
        text: newComment,
        coordinator: coordinatorId,
      });
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (err) {
      alert("Failed to post comment");
    }
  };
  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/dashboard/");
      if (response.data.ok) {
        setStats(response.data.summary);
        setUpcomingWorkshops(
          response.data.items.filter(
            (w) => w.status === 0 && new Date(w.date) >= new Date(),
          ),
        );
      } else {
        setError("Failed to load stats");
      }
    } catch (err) {
      setError("Error fetching stats");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comments/"); 
      if (response.data.ok) {
        setComments(response.data.items);
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8 pb-10 pt-4 text-stone-950">
      <h2>Instructor Statistics</h2>
      <div>
        <h3>Monthly Workshop Count</h3>
        <p>
          Total: {stats.total}, Pending: {stats.pending}, Accepted:{" "}
          {stats.accepted}
        </p>
      </div>
      <div>
        <h3>Upcoming Workshops</h3>
        <ul>
          {upcomingWorkshops.map((w) => (
            <li key={w.id}>
              {w.workshop_type.name} on {w.date}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Comments on Coordinator Profiles</h3>
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-3xl border border-stone-200 bg-slate-50 p-4">
              <p className="text-sm text-stone-900">{comment.text}</p>
              <p className="mt-2 text-xs text-stone-500">By {comment.author}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Post a comment on coordinator profile..."
            className="w-full rounded-lg border border-stone-300 p-3"
          />
           <button
            onClick={() => handlePostComment(comments[0]?.coordinator?.id || 1)} // Use first coordinator ID or default to 1
            className="mt-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorStats;
