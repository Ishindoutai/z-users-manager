import { useState } from 'react';
import api from '../services/api';

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      await api.post('/users', userData);
      await fetchUsers();
    } catch (err) {
      throw new Error('Failed to create user');
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await api.put(`/users/${id}`, userData);
      await fetchUsers();
    } catch (err) {
      throw new Error('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      throw new Error('Failed to delete user');
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