import { User, UserCreateData } from '../types/user';

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://127.0.0.1:5001/z-users-manager/us-central1`
  : `https://us-central1-z-users-manager.cloudfunctions.net`;

const validateUid = (uid: string) => {
  if (!uid || typeof uid !== 'string' || uid.trim() === '') {
    throw new Error('Invalid user ID provided');
  }
  return uid.trim();
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  
  if (!response.ok) {
    const errorData = isJson ? await response.json().catch(() => ({})) : {};
    const errorMessage = errorData.error || errorData.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return isJson ? response.json() : response.text();
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await handleResponse(response) as T;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error instanceof Error ? error : new Error('Network request failed');
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const data = await apiRequest<User[]>('/getUsers');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    const { email, password, permissions } = userData;
    const payload = {
      email,
      password,
      ...(permissions ? { permissions } : {})
    };

    return await apiRequest<User>('/createUser', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const updateUser = async (uid: string, permissions: string[]): Promise<User> => {
  try {
    const validUid = validateUid(uid);
    
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array');
    }

    return await apiRequest<User>(`/updateUser/${validUid}`, {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  } catch (error) {
    console.error(`Failed to update user ${uid}:`, error);
    throw error;
  }
};