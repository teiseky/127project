import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const OrganizationMembers = () => {
  const [memberships, setMemberships] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [formData, setFormData] = useState({
    studentNumber: '',
    role: '',
    status: 'active',
    semester: '',
    academicYear: '',
    committee: '',
  });

  useEffect(() => {
    fetchOrganizations();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchMemberships(selectedOrg);
    } else {
      setMemberships([]);
    }
  }, [selectedOrg]);

  // Helper function to safely extract string values from objects
  const safeStringValue = (value, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.name || value.Name || value.id || value.ID || String(value) || fallback;
    }
    return String(value);
  };

  const fetchMemberships = async (organizationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/organizations/${organizationId}/members`);
      
      console.log('Raw API Response:', response.data);
      
      // Process and normalize all data to ensure no objects are passed to React
      const processedMemberships = response.data.map((membership, index) => {
        console.log('Processing membership:', membership);
        
        const processed = {
          id: index, // Add a unique ID for React keys
          Student_number: safeStringValue(membership.Student_number),
          Member: safeStringValue(membership.Member, 'Unknown Member'),
          role: safeStringValue(membership.role, 'No Role'),
          status: safeStringValue(membership.status, 'Unknown'),
          semester: safeStringValue(membership.semester, 'Unknown'),
          academicYear: safeStringValue(membership.academicYear, 'Unknown'),
          committee: safeStringValue(membership.committee, 'No Committee')
        };

        console.log('Processed membership:', processed);
        return processed;
      });

      console.log('Final processed memberships:', processedMemberships);
      setMemberships(processedMemberships);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      alert('Error fetching memberships: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organizations');
      const formattedOrgs = response.data.map(org => ({
        ...org,
        organizationId: org.organizationId || org.Organization_id
      }));
      setOrganizations(formattedOrgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      alert('Error fetching organizations: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/members');
      console.log('Members data:', response.data);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Error fetching members: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpen = (membership = null) => {
    if (!selectedOrg) {
      alert('Please select an organization first');
      return;
    }

    if (membership) {
      setEditingMembership(membership);
      setFormData({
        studentNumber: membership.Student_number,
        role: membership.role,
        status: membership.status,
        semester: membership.semester,
        academicYear: membership.academicYear,
        committee: membership.committee,
      });
    } else {
      setEditingMembership(null);
      setFormData({
        studentNumber: '',
        role: '',
        status: 'active',
        semester: '',
        academicYear: '',
        committee: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMembership(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedOrg) {
        alert('Please select an organization first');
        return;
      }

      const membershipData = {
        studentNumber: formData.studentNumber,
        role: formData.role,
        status: formData.status,
        semester: formData.semester,
        academicYear: formData.academicYear,
        committee: formData.committee
      };

      if (editingMembership) {
        await axios.put(`http://localhost:5000/api/organizations/${selectedOrg}/members/${editingMembership.Student_number}`, membershipData);
      } else {
        await axios.post(`http://localhost:5000/api/organizations/${selectedOrg}/members`, membershipData);
      }
      fetchMemberships(selectedOrg);
      handleClose();
    } catch (error) {
      console.error('Error saving membership:', error);
      alert('Error saving membership: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (studentNumber) => {
    // Ensure studentNumber is a string
    const safeStudentNumber = safeStringValue(studentNumber);
    
    if (window.confirm('Are you sure you want to remove this member from the organization?')) {
      try {
        await axios.delete(`http://localhost:5000/api/organizations/${selectedOrg}/members/${safeStudentNumber}`);
        fetchMemberships(selectedOrg);
      } catch (error) {
        console.error('Error deleting membership:', error);
        alert('Error deleting membership: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Filter out members who are already in the selected organization
  const getAvailableMembers = () => {
    if (!selectedOrg) return members;
    const existingMemberIds = memberships.map(m => m.Student_number);
    return members.filter(m => !existingMemberIds.includes(m.studentNumber));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Organization Members</h1>
      </div>

      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Organization
          </label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="input-field"
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.organizationId} value={org.organizationId}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {selectedOrg && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => handleOpen()}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberships.map((membership) => (
                    <tr key={membership.Student_number || membership.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {membership.Member}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {membership.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          membership.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {membership.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {membership.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {membership.academicYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {membership.committee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpen(membership)}
                            className="text-up-maroon hover:text-up-maroon-light"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(membership.Student_number)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingMembership ? 'Edit Member' : 'Add Member'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                  disabled={editingMembership}
                >
                  <option value="">Select Student</option>
                  {editingMembership ? (
                    <option value={editingMembership.Student_number}>
                      {editingMembership.Member} ({editingMembership.Student_number})
                    </option>
                  ) : (
                    getAvailableMembers().map((member) => (
                      <option key={member.studentNumber} value={member.studentNumber}>
                        {member.name} ({member.studentNumber})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                >
                  <option value="">Select Role</option>
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
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="expelled">Expelled</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="Midyear">Midyear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2023-2024"
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Committee</label>
                <input
                  type="text"
                  name="committee"
                  value={formData.committee}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingMembership ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationMembers;