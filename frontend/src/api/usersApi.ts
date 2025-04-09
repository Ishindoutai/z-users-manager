import { User, UserCreateData } from '../types/user';

// Configuração dinâmica para ambiente de desenvolvimento/produção
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://127.0.0.1:5001/z-users-manager/us-central1`
  : `https://southamerica-east1-z-users-manager.cloudfunctions.net`;

// Handler genérico para respostas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || 'Request failed';
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
};

// Wrapper para fetch com tratamento de CORS
const fetchWithCors = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Network Error:', error);
    throw new Error('Network request failed');
  }
};

// API Methods
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const data = await fetchWithCors(`${API_BASE_URL}/getUsers`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch users');
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    return await fetchWithCors(`${API_BASE_URL}/createUser`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
};

export const updateUser = async (uid: string, permissions: string[]): Promise<User> => {
  try {
    return await fetchWithCors(`${API_BASE_URL}/updateUser/${uid}`, {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user');
  }
};