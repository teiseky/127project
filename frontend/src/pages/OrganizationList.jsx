import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
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

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organizations');
      setOrganizations(response.data);
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
        await axios.put(`http://localhost:5000/api/organizations/${editingOrg.organizationId}`, orgData);
      } else {
        await axios.post('http://localhost:5000/api/organizations', orgData);
      }
      fetchOrganizations();
      handleClose();
    } catch (error) {
      console.error('Error saving organization:', error);
      alert('Error saving organization: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (organizationId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await axios.delete(`http://localhost:5000/api/organizations/${organizationId}`);
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
        <button
          onClick={() => handleOpen()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Organization</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founded Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((org) => (
                <tr key={org.organizationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.organizationId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.scope}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.contactEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.contactPhone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {org.foundedDate ? new Date(org.foundedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpen(org)}
                        className="text-up-maroon hover:text-up-maroon-light"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(org.organizationId)}
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
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingOrg ? 'Edit Organization' : 'Add Organization'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization ID</label>
                <input
                  type="text"
                  name="organizationId"
                  value={formData.organizationId}
                  onChange={handleChange}
                  disabled={!!editingOrg}
                  required
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <select
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                >
                  <option value="">Select Scope</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="Department">Department</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                >
                  <option value="">Select Type</option>
                  <option value="Academic">Academic</option>
                  <option value="Non-Academic">Non-Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Date</label>
                <input
                  type="date"
                  name="foundedDate"
                  value={formData.foundedDate}
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
                  {editingOrg ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationList; 