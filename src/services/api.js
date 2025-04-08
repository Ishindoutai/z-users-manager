const API_URL = 'https://us-central1-SEU_PROJETO.cloudfunctions.net/api';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const updateUser = async (uid, userData) => {
  const response = await fetch(`${API_URL}/users/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};