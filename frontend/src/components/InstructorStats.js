import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstructorStats = ({ auth }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, upcoming: 0 });
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchComments();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/');
      if (response.data.ok) {
        setStats(response.data.summary);
        setUpcomingWorkshops(response.data.items.filter(w => w.status === 0 && new Date(w.date) >= new Date()));
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('Error fetching stats');
    }
  };

  const fetchComments = async () => {
    try {
      // Assuming comments API exists for coordinator profiles
      const response = await axios.get('/api/comments/'); // Adjust URL
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
    <div>
      <h2>Instructor Statistics</h2>
      <div>
        <h3>Monthly Workshop Count</h3>
        <p>Total: {stats.total}, Pending: {stats.pending}, Accepted: {stats.accepted}</p>
      </div>
      <div>
        <h3>Upcoming Workshops</h3>
        <ul>
          {upcomingWorkshops.map(w => (
            <li key={w.id}>{w.workshop_type.name} on {w.date}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Comments on Coordinator Profiles</h3>
        <ul>
          {comments.map(c => (
            <li key={c.id}>{c.text} by {c.author}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorStats;