import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'owner') {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setLoading(false);
      }
    };

    if (userInfo?.role === 'owner') {
      fetchUsers();
    }
  }, [userInfo]);

  const getUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setSelectedUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Could not load user details');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('User role updated successfully');

      const { data } = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      toast.success('User deleted successfully');

      const { data } = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setUsers(data);

      if (selectedUser?.user._id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">User Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* User List */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">All Users</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {users.map((user) => (
                <div key={user._id} className="flex justify-between items-start border-b pb-4">
                  <div>
                    <p className="text-lg font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="mt-2 border rounded px-2 py-1 text-sm"
                      disabled={user._id === userInfo._id}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => getUserDetails(user._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      disabled={user._id === userInfo._id}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Details */}
          {selectedUser && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">User Details</h2>
              <div className="space-y-4 text-gray-800">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{selectedUser.user.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedUser.user.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Role:</p>
                  <p className="capitalize">{selectedUser.user.role}</p>
                </div>

                {/* Performance Summary */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Performance Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Total Assignments</p>
                      <p className="text-xl font-bold">{selectedUser.statistics.totalAssignments}</p>
                      <p className="text-sm text-gray-400">
                        In Progress: {selectedUser.statistics.inProgressAssignments}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-xl font-bold text-green-600">
                        {selectedUser.statistics.completedAssignments}
                      </p>
                      <p className="text-sm text-gray-400">
                        Success Rate: {selectedUser.statistics.completionRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <p className="text-sm text-gray-500">Total Carats</p>
                      <p className="text-xl font-bold text-blue-600">
                        {selectedUser.statistics.totalCaratsHandled}
                      </p>
                      <p className="text-sm text-gray-400">
                        Completed: {selectedUser.statistics.completedCarats} carats
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Assignments */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Assignments</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm table-auto">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="px-4 py-2">Diamond ID</th>
                          <th className="px-4 py-2">Carats</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Assigned Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.statistics.recentAssignments.map((a, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2">{a.diamondId}</td>
                            <td className="px-4 py-2">{a.carat}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  a.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : a.status === 'in_progress'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {new Date(a.assignedDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
