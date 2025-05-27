import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // import useParams

const UserFees = () => {
  const { studentNumber } = useParams(); // get studentNumber from route
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentNumber) {
      setError('Student number is required.');
      setLoading(false);
      return;
    }

    const fetchFees = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:5000/api/users/late-fees?studentNumber=${studentNumber}`
        );
        setFees(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [studentNumber]);

  if (loading) return <p>Loading unpaid fees...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (fees.length === 0) return <p>No unpaid fees found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Unpaid Fees</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Organization</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Semester</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Academic Year</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-2">{fee.Organization?.name || '-'}</td>
              <td className="border border-gray-300 px-4 py-2">{fee.semester}</td>
              <td className="border border-gray-300 px-4 py-2">{fee.academicYear}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{fee.amount.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2">{fee.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFees;
