import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserCircle } from 'lucide-react';

const UserDashboard = () => {
  const { studentNumber } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'expelled':
        return 'bg-red-100 text-red-800';
      case 'alumni':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'president':
        return 'bg-purple-100 text-purple-800';
      case 'vice president':
        return 'bg-indigo-100 text-indigo-800';
      case 'secretary':
        return 'bg-cyan-100 text-cyan-800';
      case 'treasurer':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (!studentNumber) {
      setError('No student number found.');
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
    <div className="w-[80%] ml-auto pt-6 pr-3 space-y-6">
      {/* Header + Profile Card side by side */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Header */}
        <div className="w-full md:w-7/12 bg-white rounded-2xl shadow p-4 border-l-4 border-red-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-2 rounded-lg">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                <span className="text-up-maroon">Hello, </span>
                {memberData.name || 'User'}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">View your info and organizations here.</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="w-full md:w-5/12 bg-white rounded-2xl shadow p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-up-maroon">Student Information</h2>
          <div className="space-y-1 text-sm text-gray-800">
            <p><strong>Student Number: </strong>
              <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded-full">{memberData.studentNumber}</span>
            </p>
            <p><strong>Program: </strong>
              <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded-full">{memberData.degreeProgram}</span>
            </p>
            <p><strong>Age: </strong>
              <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded-full">{memberData.age}</span>
            </p>
            <p><strong>Gender: </strong>
              <span className={`px-2 py-0.5 rounded-full font-mono ${memberData.gender === 'Male'
                ? 'bg-blue-100 text-blue-800'
                : memberData.gender === 'Female'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {memberData.gender}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Organizations */}
      <div className="w-full bg-up-maroon-light shadow rounded-2xl p-5 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-white"> My Organizations</h2>
        {memberData.Organizations?.length > 0 ? (
          <ul className="space-y-3">
            {memberData.Organizations.map((org) => (
              <li key={org.organizationId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="font-medium text-gray-800">{org.name}</p>
                <p className="text-xs text-gray-600">
                  Role: <span className={`px-2 py-0.5 rounded-full ${getRoleColor(org.ServesIn?.role || '')}`}>
                    {org.ServesIn?.role || 'None'}
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  Status: <span className={`px-2 py-0.5 rounded-full ${getStatusColor(org.ServesIn?.status || '')}`}>
                    {org.ServesIn?.status || 'Unknown'}
                  </span>
                </p>
                <p className="text-xs text-gray-600">Committee: <strong>{org.ServesIn?.committee || 'None'}</strong></p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-sm">No organizations found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
