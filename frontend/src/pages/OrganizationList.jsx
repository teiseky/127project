import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Building2, X, Mail, Phone } from 'lucide-react';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({
    organizationId: '',
    name: '',
    scope: '',
    type: '',
    description: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    status: 'active',
    foundedDate: '',
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [searchQuery, organizations]);

  const filterOrganizations = () => {
    if (!searchQuery.trim()) {
      setFilteredOrganizations(organizations);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = organizations.filter(org => 
      org.name.toLowerCase().includes(query) ||
      org.organizationId.toLowerCase().includes(query)
    );
    setFilteredOrganizations(filtered);
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/organizations');
      const data = await response.json();
      setOrganizations(data);
      setFilteredOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleOpen = (org = null) => {
    if (org) {
      setEditingOrg(org);
      setFormData({
        ...org,
        foundedDate: org.foundedDate ? new Date(org.foundedDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingOrg(null);
      setFormData({
        organizationId: '',
        name: '',
        scope: '',
        type: '',
        description: '',
        address: '',
        contactEmail: '',
        contactPhone: '',
        status: 'active',
        foundedDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingOrg(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orgData = {
        ...formData,
        organizationId: formData.organizationId.trim()
      };

      if (editingOrg) {
        await fetch(`http://localhost:5000/api/organizations/${editingOrg.organizationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orgData)
        });
      } else {
        await fetch('http://localhost:5000/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orgData)
        });
      }
      fetchOrganizations();
      handleClose();
    } catch (error) {
      console.error('Error saving organization:', error);
      alert('Error saving organization: ' + error.message);
    }
  };

  const handleDelete = async (organizationId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await fetch(`http://localhost:5000/api/organizations/${organizationId}`, {
          method: 'DELETE'
        });
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-none px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 border-l-8 border-red-800">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-800 to-red-900 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization List</h1>
                <p className="text-gray-600 text-sm">University of 127 Organization Directory</p>
              </div>
            </div>
            <button
              onClick={() => handleOpen()}
              className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Add Organization</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-4">
          <div className="bg-white rounded-xl shadow-lg p-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or organization code..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Table - Takes remaining space */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 min-h-0">
        <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
          <div className="bg-gradient-to-r from-red-800 to-red-900 px-4 py-3 rounded-t-2xl flex-none">
            <h2 className="text-lg font-semibold text-white">
              Organizations Directory ({filteredOrganizations.length} {filteredOrganizations.length === 1 ? 'organization' : 'organizations'})
            </h2>
          </div>
          
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Organization ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scope</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Info</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Founded Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrganizations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No organizations found</p>
                        <p className="text-sm">Add your first organization to get started</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrganizations.map((org, index) => (
                      <tr key={org.organizationId} className={`hover:bg-red-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-red-800 bg-red-100 px-2 py-1 rounded-md">{org.organizationId}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{org.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {org.scope}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{org.type}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {org.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            {org.contactEmail && (
                              <div className="flex items-center text-xs text-gray-700">
                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="truncate max-w-32" title={org.contactEmail}>{org.contactEmail}</span>
                              </div>
                            )}
                            {org.contactPhone && (
                              <div className="flex items-center text-xs text-gray-700">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{org.contactPhone}</span>
                              </div>
                            )}
                            {!org.contactEmail && !org.contactPhone && (
                              <span className="text-gray-400 italic text-xs">Not specified</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {org.foundedDate ? new Date(org.foundedDate).toLocaleDateString() : 
                            <span className="text-gray-400 italic">Not specified</span>
                          }
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleOpen(org)}
                              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-150"
                              title="Edit organization"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(org.organizationId)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-150"
                              title="Delete organization"
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
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-semibold text-white">
                {editingOrg ? 'Edit Organization' : 'Add New Organization'}
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Organization ID</label>
                  <input
                    type="text"
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleChange}
                    disabled={!!editingOrg}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="e.g., ORG-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scope</label>
                  <select
                    name="scope"
                    value={formData.scope}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Scope</option>
                    <option value="University">University</option>
                    <option value="College">College</option>
                    <option value="Department">Department</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Academic, Non-Academic, Cultural, Sports"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                    placeholder="Enter contact email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                    placeholder="Enter contact phone"
                  />
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
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Founded Date</label>
                  <input
                    type="date"
                    name="foundedDate"
                    value={formData.foundedDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Enter organization address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                  placeholder="Enter organization description"
                />
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
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {editingOrg ? 'Update Organization' : 'Add Organization'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationList;