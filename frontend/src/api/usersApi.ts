import { User, UserCreateData } from '../types/user';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://127.0.0.1:5001/z-users-manager/us-central1`
  : `https://southamerica-east1-z-users-manager.cloudfunctions.net`;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse<T>(response);
};

export const UsersApi = {
  async fetchAll(): Promise<User[]> {
    try {
      const data = await apiRequest<User[]>('/getUsers');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  async create(userData: UserCreateData): Promise<User> {
    try {
      const { email, password, permissions = [] } = userData;
      return await apiRequest<User>('/createUser', {
        method: 'POST',
        body: JSON.stringify({ email, password, permissions }),
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async update(uid: string, permissions: string[]): Promise<User> {
    try {
      if (!uid) throw new Error('User ID is required');
      if (!Array.isArray(permissions)) throw new Error('Permissions must be an array');
      
      return await apiRequest<User>(`/updateUser/${uid}`, {
        method: 'POST',
        body: JSON.stringify({ permissions }),
      });
    } catch (error) {
      console.error(`Failed to update user ${uid}:`, error);
      throw error;
    }
  }
};