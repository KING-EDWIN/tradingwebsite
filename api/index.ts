// API helper functions for client-side requests
const API_BASE = '/api';

export const api = {
  // Super Admin Authentication
  superAdminLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/super-admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // User Authentication
  userLogin: async (token: string) => {
    const response = await fetch(`${API_BASE}/auth/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return response.json();
  },

  userRegister: async (email: string, name: string, token: string) => {
    const response = await fetch(`${API_BASE}/auth/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, token }),
    });
    return response.json();
  },

  // Admin Functions
  generateToken: async (adminToken: string) => {
    const response = await fetch(`${API_BASE}/admin/tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.json();
  },

  getTokens: async (adminToken: string) => {
    const response = await fetch(`${API_BASE}/admin/tokens`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.json();
  },

  deleteToken: async (adminToken: string, tokenId: string) => {
    const response = await fetch(`${API_BASE}/admin/tokens?id=${tokenId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.json();
  },

  getUsers: async (adminToken: string) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.json();
  },

  updateUserStatus: async (adminToken: string, userId: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ userId, status }),
    });
    return response.json();
  },
};



