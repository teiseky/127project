import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PhilippinePeso, CheckCircle2 } from 'lucide-react';

const UserFees = () => {
  const { studentNumber } = useParams();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterSemester, setFilterSemester] = useState('');
  const [filterAcadYear, setFilterAcadYear] = useState('');
  const [filterType, setFilterType] = useState('');

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

  // Format amount with commas and 2 decimals
  const formatCurrency = (num) =>
    num.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });

  // Filter fees based on filter states
  const filteredFees = fees.filter(fee => {
    return (
      (filterSemester === '' || fee.semester === filterSemester) &&
      (filterAcadYear === '' || fee.academicYear === filterAcadYear) &&
      (filterType === '' || fee.type === filterType)
    );
  });

  return (
    <div className="w-[80%] ml-auto pt-6 pr-3 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border-l-8 border-red-800">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-3 rounded-xl">
              <PhilippinePeso className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unpaid Fees</h1>
              <p className="text-gray-600 mt-1">You may filter your unpaid fees by semester, academic year, and type.</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading unpaid fees...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">No Unpaid Fees</h2>
            <p className="text-gray-600">You have no outstanding fees at this time.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Semester Filter */}
            <div>
              <label htmlFor="semesterFilter" className="block mb-1 font-medium text-gray-700">
                Semester
              </label>
              <select
                id="semesterFilter"
                className="border rounded-md px-3 py-2 focus:outline-up-maroon-light"
                value={filterSemester}
                onChange={e => setFilterSemester(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(fees.map(fee => fee.semester))].map((sem, i) => (
                  <option key={i} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label htmlFor="acadYearFilter" className="block mb-1 font-medium text-gray-700">
                Academic Year
              </label>
              <select
                id="acadYearFilter"
                className="border rounded-md px-3 py-2 focus:outline-up-maroon-light"
                value={filterAcadYear}
                onChange={e => setFilterAcadYear(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(fees.map(fee => fee.academicYear))].map((year, i) => (
                  <option key={i} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="typeFilter" className="block mb-1 font-medium text-gray-700">
                Type
              </label>
              <select
                id="typeFilter"
                className="border rounded-md px-3 py-2 focus:outline-up-maroon-light"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(fees.map(fee => fee.type))].map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fees Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="min-w-full table-auto border-collapse">
              <caption className="sr-only">List of unpaid fees</caption>
              <thead className="bg-up-maroon-light text-white sticky top-0">
                <tr>
                  <th className="border-b border-up-maroon-light px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="border-b border-up-maroon-light px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="border-b border-up-maroon-light px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="border-b border-up-maroon-light px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="border-b border-up-maroon-light px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No fees match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="border-b border-gray-200 px-6 py-4 text-gray-800 font-medium">
                        {fee.Organization?.name || '-'}
                      </td>
                      <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                        {fee.semester}
                      </td>
                      <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                        {fee.academicYear}
                      </td>
                      <td className="border-b border-gray-200 px-6 py-4 text-right text-gray-900 font-semibold">
                        {formatCurrency(fee.amount)}
                      </td>
                      <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                        {fee.type}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UserFees;
