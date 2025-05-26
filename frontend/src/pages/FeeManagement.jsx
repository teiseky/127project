import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
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
  });

  useEffect(() => {
    fetchFees();
    fetchOrganizations();
    fetchMembers();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      alert('Error fetching fees: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organizations');
      setOrganizations(response.data);
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
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFee(null);
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
      if (editingFee) {
        await axios.put(`http://localhost:5000/api/fees/${editingFee.transactionId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/fees', formData);
      }
      fetchFees();
      handleClose();
    } catch (error) {
      console.error('Error saving fee:', error);
      alert('Error saving fee: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/fees/${transactionId}`);
        fetchFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
        alert('Error deleting fee: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        <button
          onClick={() => handleOpen()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Fee</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.map((fee) => (
                <tr key={fee.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {members.find(m => m.studentNumber === fee.studentNumber)?.name || 'Unknown Member'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {organizations.find(o => o.organizationId === fee.organizationId)?.name || 'Unknown Organization'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{fee.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.academicYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.paymentDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpen(fee)}
                        className="text-up-maroon hover:text-up-maroon-light"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(fee.transactionId)}
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
                {editingFee ? 'Edit Fee' : 'Add Fee'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    disabled={!!editingFee}
                    required
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    required
                    className="input-field mt-1"
                  >
                    <option value="">Select Student</option>
                    {members.map((member) => (
                      <option key={member.studentNumber} value={member.studentNumber}>
                        {member.name} ({member.studentNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <select
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleChange}
                    required
                    className="input-field mt-1"
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
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="input-field mt-1"
                  />
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
                    <option value="Membership">Membership</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
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
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="input-field mt-1"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="input-field mt-1"
                  />
                </div>
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
                  {editingFee ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement; 