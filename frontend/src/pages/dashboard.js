// Dashboard Component
// The main component for the dashboard page which manages user interactions and displays relevant data.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    // State variables to manage data and loading status
    const [data, setData] = useState([]); // Holds the data fetched from the API
    const [loading, setLoading] = useState(true); // Loading state for fetch requests
    const [error, setError] = useState(null); // Error state to handle API call failures

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchData(); // Fetching data from the API
    }, []);

    // Function to fetch data from an external API
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/data'); // API call to fetch data
            setData(response.data); // Updating state with the fetched data
            setLoading(false); // Setting loading to false once data is fetched successfully
        } catch (err) {
            setError(err); // Handling errors by updating the error state
            setLoading(false); // Setting loading to false in case of error
        }
    };

    // Conditional rendering based on loading and error states
    if (loading) return <div>Loading...</div>; // Show loading message while data is being fetched
    if (error) return <div>Error fetching data</div>; // Show error message if API call fails

    // Filtering logic for user roles (e.g., admin or user)
    const filteredData = data.filter(item => item.role === 'user'); // Only displaying user-related data

    // Handling any user-interaction methods, like refreshing the data
    const handleRefresh = () => {
        fetchData(); // Refreshing data by re-fetching from the API
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleRefresh}>Refresh Data</button> {/* Button to refresh data */}
            <ul>
                {filteredData.map(item => (
                    <li key={item.id}>{item.name}</li> // Displaying fetched data items
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;