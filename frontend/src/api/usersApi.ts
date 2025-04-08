import axios from 'axios';
import { User, UserCreateData } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/your-project/us-central1/api';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUsers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createUser`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create user');
  }
};

export const updateUser = async (uid: string, permissions: string[]): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateUser/${uid}`, { permissions });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update user');
  }
};