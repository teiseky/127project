import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Filter, Search, X } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('1');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [filters, setFilters] = useState({
    organization: '',
    semester: '',
    academicYear: '',
    role: '',
    status: '',
    gender: '',
    degreeProgram: '',
    batch: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    limit: '10',
    studentNumber: '',
    n: '',
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [reportType, filters]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/organizations');
      setOrganizations(response.data);
    } catch (error) {
      setError('Failed to fetch organizations');
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      if (reportType === '1' && !filters.organization) {
        setError('Please select an organization');
        setLoading(false);
        return;
      }
      if (reportType === '2' && (!filters.organization || !filters.semester || !filters.academicYear)) {
        setError('Please select organization, semester, and academic year');
        setLoading(false);
        return;
      }
      if (reportType === '3' && !filters.studentNumber) {
        setError('Please enter a student number');
        setLoading(false);
        return;
      }
      if (reportType === '4' && (!filters.organization || !filters.academicYear)) {
        setError('Please select an organization and academic year');
        setLoading(false);
        return;
      }
      if (reportType === '5' && (!filters.organization || !filters.role)) {
        setError('Please select an organization and role');
        setLoading(false);
        return;
      }
      if (reportType === '6' && (!filters.organization || !filters.semester || !filters.academicYear)) {
        setError('Please select organization, semester, and academic year for late payments report');
        setLoading(false);
        return;
      }
      if (reportType === '7' && (!filters.organization || !filters.n)) {
        setError('Please select organization and enter the last n semesters');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/reports/${reportType}`, {
        params: filters
      });
      setReportData(response.data);
      console.log('Report data fetched:', response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.details || 
        'Failed to fetch report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (newReportType) => {
    setReportType(newReportType);
    setFilters({
      organization: '',
      semester: (newReportType === '2' || newReportType === '6') ? '1st Semester' : '',
      academicYear: '',
      role: (newReportType === '5') ? 'President' : '',
      status: '',
      gender: '',
      degreeProgram: '',
      batch: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      limit: '10',
      studentNumber: '',
      n: '',
    });
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const renderCellValue = (cell) => {
    if (cell === null || cell === undefined) {
      return '';
    }
    if (typeof cell === 'object') {
      if (cell.name) {
        return cell.name;
      }
      if (Array.isArray(cell)) {
        return cell.join(', ');
      }
      return JSON.stringify(cell);
    }
    return String(cell);
  };

  const renderFilters = () => {
    switch (reportType) {
      case '1': // View all members
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization *</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Roles</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Member">Member</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="alumni">Alumni</option>
                <option value="expelled">Expelled</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Degree Program</label>
              <input
                type="text"
                name="degreeProgram"
                value={filters.degreeProgram}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Batch (Year)</label>
              <input
                type="text"
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                placeholder="e.g., 2023"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>
        );

      case '2': // Unpaid fees
      case '6': // Late payments
      case '10': // Member/s with highest debt
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">Select Semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="Midyear">Midyear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>
        );

      case '3': // Member POV of unpaid fees
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Number</label>
              <input
                type="text"
                name="studentNumber"
                value={filters.studentNumber}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="Enter Student Number"
              />
            </div>
          </div>
        );

      case '4': // View exec
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>
        );

      case '5': // View all previous roles
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
        );

      case '7': // Percentage of active vs inactive members
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semesters</label>
              <input
                type="text"
                name="n"
                value={filters.n}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="Enter the last n semesters"
              />
            </div>
          </div>
        );

      case '8': // View all alumni members as of given date
      case '9': // Total fees status
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.organizationId} value={org.organizationId}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                placeholder="Enter the date (e.g. 2025-05-25)"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderReportTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-800 p-4 mb-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-800" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!reportData.length) {
      return (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">No data found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters to view report data</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(reportData[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {header.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reportData.map((row, index) => (
              <tr key={index} className={`hover:bg-red-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {renderCellValue(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const reportTypes = [
    { id: '1', name: 'All Members', description: 'View all members of an organization with filtering options' },
    { id: '2', name: 'Organization\'s Unpaid Fees', description: 'List of unpaid fees for an organization' },
    { id: '3', name: 'Member\'s Unpaid Fees', description: 'Unpaid fees for a specific member' },
    { id: '4', name: 'Executive Committee Roster', description: 'Current executive committee members' },
    { id: '5', name: 'Previous Roles', description: 'Historical roles within an organization' },
    { id: '6', name: 'Late Payments', description: 'Fees paid after due dates' },
    { id: '7', name: 'Member Growth', description: 'Active vs inactive member percentages' },
    { id: '8', name: 'Alumni Members', description: 'List of alumni members as of a date' },
    { id: '9', name: 'Total Fees Status', description: 'Summary of fee payments status' },
    { id: '10', name: 'Highest Debt Members', description: 'Members with the highest outstanding fees' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border-l-8 border-red-800">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-800 to-red-900 p-3 rounded-xl">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">University of 127 Reports Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Report Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => handleReportChange(report.id)}
                  className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                    reportType === report.id
                      ? 'border-red-800 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="text-sm font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
            {renderFilters()}
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Report Results ({reportData.length} {reportData.length === 1 ? 'record' : 'records'})
            </h2>
          </div>
          {renderReportTable()}
        </div>
      </div>
    </div>
  );
};

export default Reports;