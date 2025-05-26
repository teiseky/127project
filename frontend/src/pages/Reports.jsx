import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Download, RefreshCw } from 'lucide-react';

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

  const handleReportChange = (event) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    setFilters({
      organization: '',
      semester: (newReportType === '2' || newReportType === '6') ? '1st' : '', // Default to 1st semester for unpaid fees report and case 6
      academicYear: '',
      role: (newReportType === '5') ? 'President' : '', // Default to President for previous roles report,
      status: '',
      gender: '',
      degreeProgram: '',
      batch: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      limit: '10',
    });
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
    console.log('Filters updated:', {
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  // Helper function to safely render cell values
  const renderCellValue = (cell) => {
    if (cell === null || cell === undefined) {
      return '';
    }
    
    if (typeof cell === 'object') {
      // Handle different object types
      if (cell.name) {
        return cell.name; // For objects with name property
      }
      if (Array.isArray(cell)) {
        return cell.join(', '); // For arrays
      }
      return JSON.stringify(cell); // Fallback for other objects
    }
    
    return String(cell); // Convert to string for safe rendering
  };

  const renderFilters = () => {
    switch (reportType) {
      case '1': // View all members
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization *</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="input-field mt-1"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree Program</label>
              <input
                type="text"
                name="degreeProgram"
                value={filters.degreeProgram}
                onChange={handleFilterChange}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch (Year)</label>
              <input
                type="text"
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                placeholder="e.g., 2023"
                className="input-field mt-1"
              />
            </div>
          </div>
        );

      case '2': // Unpaid fees
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="input-field mt-1"
              >
                <option value="1st">First</option>
                <option value="2nd">Second</option>
                <option value="Midyear">Midyear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="input-field mt-1"
              />
            </div>
          </div>
        )
      case '3': // Member POV of unpaid fees
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Students</label>
              <input
                type="text"
                name="studentNumber"
                value={filters.studentNumber}
                onChange={handleFilterChange}
                className="input-field mt-1"
                placeholder="Enter Student Number"
              />
            </div>
          </div>
        )
      case '4': // View exec
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="input-field mt-1"
              />
            </div>
          </div>
        )
      case '5': // View all previous roles
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="input-field mt-1"
              >
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
        )
      case '6': // Late payments
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="input-field mt-1"
              >
                <option value="1st">First</option>
                <option value="2nd">Second</option>
                <option value="Midyear">Midyear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="input-field mt-1"
              />
            </div>
          </div>
        )
      case '9': // Total fees status
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <select
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="input-field mt-1"
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
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="input-field mt-1"
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Midyear">Midyear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="input-field mt-1"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-up-maroon"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!reportData.length) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for the selected filters.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(reportData[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="flex space-x-4">
          <button
            onClick={fetchReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={handleReportChange}
              className="input-field mt-1"
            >
              <option value="1">All Members</option>
              <option value="2">Organization's Unpaid Fees</option>
              <option value="3">Member's Unpaid fees</option>
              <option value="4">Executive Committee Roster</option>
              <option value="5">View all previous roles</option>
              <option value="6">Late Payments</option>
              <option value="7">Member Growth</option>
              <option value="8">Organization Growth</option>
              <option value="9">Total Fees Status</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {renderFilters()}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Results</h3>
            {renderReportTable()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;