const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:5001/z-users-manager/us-central1'
  : 'https://southamerica-east1-z-users-manager.cloudfunctions.net';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse(response);
};

export const UsersApi = {
  async fetchAll() {
    try {
      const data = await apiRequest('/userList');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  async create(userData) {
    try {
      const { email, password, permissions = [] } = userData;
      return await apiRequest('/userCreate', {
        method: 'POST',
        body: JSON.stringify({ email, password, permissions }),
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async update(uid, permissions) {
    try {
      if (!uid) throw new Error('User ID is required');
      if (!Array.isArray(permissions)) throw new Error('Permissions must be an array');
      
      return await apiRequest(`/userUpdate/${uid}`, {
        method: 'PATCH',
        body: JSON.stringify({ permissions }),
      });
    } catch (error) {
      console.error(`Failed to update user ${uid}:`, error);
      throw error;
    }
  }
};