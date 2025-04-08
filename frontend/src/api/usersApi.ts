import { User, UserCreateData } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/your-project/us-central1/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getUsers`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch users');
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
};

export const updateUser = async (uid: string, permissions: string[]): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateUser/${uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user');
  }
};