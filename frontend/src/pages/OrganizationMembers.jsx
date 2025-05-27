import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Users, X, Building2, UserPlus } from 'lucide-react';
import axios from 'axios';

const OrganizationMembers = () => {
  const [memberships, setMemberships] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMemberships, setFilteredMemberships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      setFilteredMemberships([]);
    }
  }, [selectedOrg]);

  useEffect(() => {
    filterMemberships();
  }, [searchQuery, memberships]);

  const filterMemberships = () => {
    if (!searchQuery.trim()) {
      setFilteredMemberships(memberships);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = memberships.filter(membership => 
      membership.Member.toLowerCase().includes(query) ||
      membership.Student_number.toLowerCase().includes(query) ||
      membership.role.toLowerCase().includes(query) ||
      membership.committee.toLowerCase().includes(query)
    );
    setFilteredMemberships(filtered);
  };

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
      
      // Process and normalize all data to ensure no objects are passed to React
      const processedMemberships = response.data.map((membership, index) => {
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

        return processed;
      });

      setMemberships(processedMemberships);
      setFilteredMemberships(processedMemberships);
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

  const getSelectedOrgName = () => {
    const org = organizations.find(o => o.organizationId === selectedOrg);
    return org ? org.name : 'Select Organization';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (role.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border-l-8 border-red-800">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-800 to-red-900 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Organization Members</h1>
                <p className="text-gray-600 mt-1">Manage student memberships across organizations</p>
              </div>
            </div>
            {selectedOrg && (
              <button
                onClick={() => handleOpen()}
                className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold">Add Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Organization Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200 text-lg"
            >
              <option value="">Choose an organization to view members</option>
              {organizations.map((org) => (
                <option key={org.organizationId} value={org.organizationId}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedOrg && (
          <>
            {/* Search Section */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by member name, student number, role, or committee..."
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  {getSelectedOrgName()} Members ({filteredMemberships.length} {filteredMemberships.length === 1 ? 'member' : 'members'})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Academic Info</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Committee</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredMemberships.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-lg font-medium">
                            {searchQuery ? 'No members found' : 'No members in this organization'}
                          </p>
                          <p className="text-sm">
                            {searchQuery ? 'Try adjusting your search terms' : 'Add the first member to get started'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredMemberships.map((membership, index) => (
                        <tr key={membership.Student_number || membership.id} className={`hover:bg-red-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-semibold text-gray-900">{membership.Member}</div>
                              <span className="text-xs font-mono text-red-800 bg-red-100 px-2 py-1 rounded-md inline-block w-fit mt-1">
                                {membership.Student_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(membership.role)}`}>
                              {membership.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                              {membership.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              <div>{membership.semester} Semester</div>
                              <div className="text-xs text-gray-500">{membership.academicYear}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {membership.committee || <span className="text-gray-400 italic">No committee</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpen(membership)}
                                className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-150"
                                title="Edit membership"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(membership.Student_number)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-150"
                                title="Remove from organization"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-semibold text-white">
                {editingMembership ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
                  <select
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="expelled">Expelled</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="Midyear">Midyear</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2023-2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Committee</label>
                  <input
                    type="text"
                    name="committee"
                    value={formData.committee}
                    onChange={handleChange}
                    placeholder="Optional committee assignment"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {editingMembership ? 'Update Member' : 'Add Member'}
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