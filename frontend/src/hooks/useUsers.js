import { useState } from 'react';
import api from '../services/api';
import { message } from 'antd';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      setUsers(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      message.error('Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await api.post('/users', userData);
      await fetchUsers();
      return newUser;
    } catch (err) {
      message.error('Failed to create user');
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await api.put(`/users/${id}`, userData);
      await fetchUsers();
      return updatedUser;
    } catch (err) {
      message.error('Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
      message.success('User deleted successfully');
    } catch (err) {
      message.error('Failed to delete user');
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsers;