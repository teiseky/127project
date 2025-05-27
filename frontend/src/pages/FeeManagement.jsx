import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Filter, X } from 'lucide-react';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    transactionId: '',
    studentNumber: '',
    organizationId: '',
    amount: '',
    type: '',
    semester: '',
    academicYear: '',
    status: 'unpaid',
    paymentDate: '',
    isLate: false,
  });

  useEffect(() => {
    fetchFees();
    fetchOrganizations();
    fetchMembers();
  }, []);

  useEffect(() => {
    filterFeesByOrganization();
  }, [fees, selectedOrg, searchQuery]);

  useEffect(() => {
    filterMembersByOrganization();
  }, [members, formData.organizationId]);

  const fetchFees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fees');
      const data = await response.json();
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      alert('Error fetching fees: ' + error.message);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      alert('Error fetching organizations: ' + error.message);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/members/with-orgs');
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Error fetching members: ' + error.message);
      setMembers([]);
    }
  };

  const filterFeesByOrganization = () => {
    let filtered = fees;
    if (selectedOrg) {
      filtered = filtered.filter(fee => fee.organizationId === selectedOrg);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(fee => 
        getMemberName(fee.studentNumber).toLowerCase().includes(query) ||
        fee.transactionId.toLowerCase().includes(query) ||
        getOrganizationName(fee.organizationId).toLowerCase().includes(query)
      );
    }
    setFilteredFees(filtered);
  };

  const filterMembersByOrganization = () => {
    if (!formData.organizationId) {
      setFilteredMembers([]);
      return;
    }
    const filtered = members.filter(member => 
      member.Organizations?.some(org => org.organizationId === formData.organizationId)
    );
    setFilteredMembers(filtered);
  };

  const getMemberName = (studentNumber) => {
    const member = members.find(m => m.studentNumber === studentNumber);
    return member ? member.name : 'Unknown Member';
  };

  const getOrganizationName = (organizationId) => {
    const org = organizations.find(o => o.organizationId === organizationId);
    return org ? org.name : 'Unknown Organization';
  };

  const handleOpen = (fee = null) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        transactionId: fee.transactionId,
        studentNumber: fee.studentNumber,
        organizationId: fee.organizationId,
        amount: fee.amount,
        type: fee.type,
        semester: fee.semester,
        academicYear: fee.academicYear,
        status: fee.status,
        paymentDate: fee.paymentDate || '',
        isLate: fee.isLate || false,
      });
    } else {
      setEditingFee(null);
      setFormData({
        transactionId: '',
        studentNumber: '',
        organizationId: '',
        amount: '',
        type: '',
        semester: '',
        academicYear: '',
        status: 'unpaid',
        paymentDate: '',
        isLate: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFee(null);
    setFilteredMembers([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'organizationId') {
      setFormData(prev => ({
        ...prev,
        studentNumber: '',
      }));
    }
    if (name === 'status' && value === 'unpaid') {
      setFormData(prev => ({
        ...prev,
        paymentDate: '',
        isLate: false,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      if (submitData.status === 'unpaid') {
        submitData.paymentDate = '';
        submitData.isLate = false;
      }
      if (editingFee) {
        const response = await fetch(`http://localhost:5000/api/fees/${editingFee.transactionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!response.ok) throw new Error('Failed to update fee');
      } else {
        const response = await fetch('http://localhost:5000/api/fees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!response.ok) throw new Error('Failed to create fee');
      }
      fetchFees();
      handleClose();
    } catch (error) {
      console.error('Error saving fee:', error);
      alert('Error saving fee: ' + error.message);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/fees/${transactionId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete fee');
        fetchFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
        alert('Error deleting fee: ' + error.message);
      }
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
                <Filter className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
                <p className="text-gray-600 mt-1">University of 127 Fee Directory</p>
              </div>
            </div>
            <button
              onClick={() => handleOpen()}
              className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Fee</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by transaction ID, student name, or organization..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                />
              </div>
              <div>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Organizations</option>
                  {organizations.map((org) => (
                    <option key={org.organizationId} value={org.organizationId}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Fees Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Fee Directory ({filteredFees.length} {filteredFees.length === 1 ? 'fee' : 'fees'})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Academic Year</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Late Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                      <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No fees found</p>
                      <p className="text-sm">Add your first fee to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee, index) => (
                    <tr key={fee.transactionId} className={`hover:bg-red-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-red-800 bg-red-100 px-2 py-1 rounded-md">{fee.transactionId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{getMemberName(fee.studentNumber)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{getOrganizationName(fee.organizationId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">₱{fee.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {fee.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{fee.semester}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{fee.academicYear}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fee.status === 'paid' ? (fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A') : 
                          <span className="text-gray-400 italic">Not paid</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fee.status === 'paid' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fee.isLate ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {fee.isLate ? 'Late' : 'On Time'}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpen(fee)}
                            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all duration-150"
                            title="Edit fee"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fee.transactionId)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-150"
                            title="Delete fee"
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

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-xl font-semibold text-white">
                  {editingFee ? 'Edit Fee' : 'Add New Fee'}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-red-700 transition-colors duration-150"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      disabled={!!editingFee}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="e.g., FEE-2023-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                    <select
                      name="organizationId"
                      value={formData.organizationId}
                      onChange={handleChange}
                      required
                      disabled={!!editingFee}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
                    <select
                      name="studentNumber"
                      value={formData.studentNumber}
                      onChange={handleChange}
                      required
                      disabled={!!editingFee}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select Student</option>
                      {filteredMembers.map((member) => (
                        <option key={member.studentNumber} value={member.studentNumber}>
                          {member.name} ({member.studentNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 500.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Type</option>
                      <option value="Membership">Membership</option>
                      <option value="Event">Event</option>
                      <option value="Other">Other</option>
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
                      value={formData.academicYear}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 2023-2024"
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
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  {formData.status === 'paid' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Date</label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          name="isLate"
                          checked={formData.isLate}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm font-semibold text-gray-700">
                          Late Payment
                        </label>
                      </div>
                    </>
                  )}
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
                    {editingFee ? 'Update Fee' : 'Add Fee'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;