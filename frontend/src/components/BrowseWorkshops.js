import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure Axios is configured for your API base URL

const BrowseWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableWorkshops();
  }, []);

  const fetchAvailableWorkshops = async () => {
    try {
      // Note: dashboard_api only shows user's workshops. For coordinators to browse available ones,
      // we'd need a new backend endpoint (e.g., /api/available-workshops/). For now, this is a placeholder.
      const response = await axios.get('/api/dashboard/'); // Adjust to your API base
      if (response.data.ok) {
        // Filter for available workshops (status=0, instructor set, date >= today)
        // In practice, coordinators won't see these via dashboard_api—backend needs adjustment.
        const available = response.data.items.filter(
          (w) => w.status === 0 && w.instructor && new Date(w.date) >= new Date()
        );
        setWorkshops(available);
      } else {
        setError('Failed to load workshops');
      }
    } catch (err) {
      setError('Error fetching workshops');
    } finally {
      setLoading(false);
    }
  };

  const handleBookWorkshop = async (workshop) => {
    try {
      // Workaround: Use propose_workshop_api to simulate booking (creates a new Workshop request)
      // Ideally, add a new backend API for booking existing workshops.
      const response = await axios.post('/api/workshops/propose/', {
        workshop_type: workshop.workshop_type.id,
        date: workshop.date,
        tnc_accepted: true,
      });
      if (response.data.ok) {
        alert('Booking request submitted!');
        fetchAvailableWorkshops(); // Refresh
      } else {
        alert('Booking failed: ' + response.data.message);
      }
    } catch (err) {
      alert('Error booking workshop');
    }
  };

  if (loading) return <div>Loading available workshops...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Browse and Book Instructor Workshops</h2>
      {workshops.length === 0 ? (
        <p>No available workshops to book.</p>
      ) : (
        <ul>
          {workshops.map((workshop) => (
            <li key={workshop.id}>
              <strong>{workshop.workshop_type.name}</strong> on {workshop.date} by {workshop.instructor.name}
              <button onClick={() => handleBookWorkshop(workshop)}>Book This Workshop</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrowseWorkshops;