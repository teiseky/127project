import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { studentNumber } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!studentNumber) {
      setError('No student number found. Please enter your student number.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${studentNumber}`);
        setMemberData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [studentNumber]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {memberData.name || 'User'}!</h1>
      <p>Student Number: {memberData.id}</p>

      <h2 className="mt-6 text-2xl font-semibold">Organizations</h2>
      {memberData.Organizations && memberData.Organizations.length > 0 ? (
        <ul className="list-disc list-inside">
          {memberData.Organizations.map((org) => (
            <li key={org.id}>{org.name}</li>
          ))}
        </ul>
      ) : (
        <p>No organizations found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
