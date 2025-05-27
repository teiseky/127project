import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Filter } from 'lucide-react';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
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
  }, [fees, selectedOrg]);

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
      console.log('Organizations fetched:', data.length);
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
      
      console.log('=== Members API Response Debug ===');
      console.log('Total members fetched:', data.length);
      
      if (data.length > 0) {
        const sampleMember = data[0];
        console.log('Sample member structure:', {
          studentNumber: sampleMember.studentNumber,
          name: sampleMember.name,
          organizations: sampleMember.Organizations?.length || 0,
          organizationIds: sampleMember.Organizations?.map(org => org.organizationId) || []
        });
      }
      
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Error fetching members: ' + error.message);
      setMembers([]);
    }
  };

  const filterFeesByOrganization = () => {
    if (!selectedOrg) {
      setFilteredFees(fees);
    } else {
      const filtered = fees.filter(fee => fee.organizationId === selectedOrg);
      setFilteredFees(filtered);
    }
  };

  const filterMembersByOrganization = () => {
    console.log('=== Member Filtering Debug ===');
    console.log('Selected organization ID:', formData.organizationId);
    console.log('Total members available:', members.length);
    
    if (!formData.organizationId) {
      console.log('No organization selected, clearing filtered members');
      setFilteredMembers([]);
      return;
    }

    const filtered = members.filter(member => {
      if (!member.Organizations || !Array.isArray(member.Organizations)) {
        console.log(`Member ${member.name} has no organizations array`);
        return false;
      }

      const hasOrganization = member.Organizations.some(org => {
        const orgId = org.organizationId;
        const match = orgId === formData.organizationId;
        
        if (match) {
          console.log(`✓ Member ${member.name} belongs to organization ${orgId}`);
        }
        
        return match;
      });

      return hasOrganization;
    });
    
    console.log('Filtered members count:', filtered.length);
    console.log('Filtered members:', filtered.map(m => ({ name: m.name, studentNumber: m.studentNumber })));
    
    setFilteredMembers(filtered);
  };

  // Helper function to get member name by student number
  const getMemberName = (studentNumber) => {
    const member = members.find(m => m.studentNumber === studentNumber);
    return member ? member.name : 'Unknown Member';
  };

  // Helper function to get organization name by organization ID
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

    // Clear student selection when organization changes
    if (name === 'organizationId') {
      setFormData(prev => ({
        ...prev,
        studentNumber: '',
      }));
    }

    // Clear payment date and isLate when status changes to unpaid
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
      
      // If status is unpaid, ensure paymentDate and isLate are cleared
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Fee</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Organization</label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredFees) && filteredFees.map((fee) => (
                <tr key={fee.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getMemberName(fee.studentNumber)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getOrganizationName(fee.organizationId)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fee.status === 'paid' ? (fee.paymentDate || 'N/A') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fee.status === 'paid' ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fee.isLate ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {fee.isLate ? 'Late' : 'On Time'}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpen(fee)}
                        className="text-blue-600 hover:text-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingFee ? 'Edit Fee' : 'Add Fee'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
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
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <select
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    required
                    disabled={!formData.organizationId}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">
                      {formData.organizationId ? 'Select Student' : 'Select Organization First'}
                    </option>
                    {filteredMembers.map((member) => (
                      <option key={member.studentNumber} value={member.studentNumber}>
                        {member.name} ({member.studentNumber})
                      </option>
                    ))}
                  </select>
                  {/* Debug info */}
                  <div className="mt-1 text-xs text-gray-500">
                    {formData.organizationId && (
                      <>
                        Found {filteredMembers.length} members in this organization
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
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
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                {formData.status === 'paid' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        required={formData.status === 'paid'}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        name="isLate"
                        checked={formData.isLate}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm font-medium text-gray-700">
                        Late Payment
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingFee ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;