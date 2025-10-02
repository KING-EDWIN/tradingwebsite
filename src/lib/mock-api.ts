// Mock API for local development
// This simulates the backend API responses for testing

interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string; // Added password field
  token: string; // Token used for registration (one-time use)
  status: 'active' | 'paused' | 'deleted' | 'expired';
  created_at: string;
  last_login: string | null;
  access_expires_at: string; // When their access expires (3 months from registration)
  current_token_id: string; // ID of the token that granted them access
}

interface MockToken {
  id: string;
  token: string;
  user_id: string | null;
  created_by: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string | null;
  access_duration_months: number; // How many months of access this token grants (default 3)
}

// Mock data storage
let mockUsers: MockUser[] = [];
let mockTokens: MockToken[] = [
  {
    id: '1',
    token: 'DEMO12345678',
    user_id: null,
    created_by: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    access_duration_months: 3
  }
];

// Helper function to check if user access is expired
const isUserAccessExpired = (user: MockUser): boolean => {
  const now = new Date();
  const expiresAt = new Date(user.access_expires_at);
  return now > expiresAt;
};

// Helper function to calculate access expiration date
const calculateAccessExpiration = (months: number): string => {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + (months * 30 * 24 * 60 * 60 * 1000)); // Approximate 30 days per month
  return expirationDate.toISOString();
};

// Mock API functions
export const mockApi = {
  // Super Admin Authentication
  superAdminLogin: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    if (email === 'damanifesta0@gmail.com' && password === 'KINg178.') {
      return {
        success: true,
        token: 'mock-admin-token',
        admin: {
          id: 'admin-1',
          email: 'damanifesta0@gmail.com',
          lastLogin: new Date().toISOString()
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  // User Authentication - Now supports both token and password login
  userLogin: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && (u.status === 'active' || u.status === 'expired'));
    
    if (user && user.password === password) {
      // Check if access is expired
      if (isUserAccessExpired(user)) {
        user.status = 'expired';
        return {
          success: false,
          error: 'Your access has expired. Please contact the admin for a new access token.',
          expired: true
        };
      }
      
      // Update last login
      user.last_login = new Date().toISOString();
      
      return {
        success: true,
        token: 'mock-user-token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: user.token,
          status: user.status,
          access_expires_at: user.access_expires_at
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  // Token-based login (for first-time users who only have token)
  userLoginWithToken: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.token === token && u.status === 'active');
    
    if (user) {
      // Update last login
      user.last_login = new Date().toISOString();
      
      return {
        success: true,
        token: 'mock-user-token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: user.token,
          status: user.status
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid or expired token'
    };
  },

  userRegister: async (email: string, name: string, password: string, token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tokenRecord = mockTokens.find(t => t.token === token && t.status === 'active');
    
    if (!tokenRecord) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }
    
    // Check if email already exists
    if (mockUsers.find(u => u.email === email)) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }
    
    // Create user with password and 3-month access
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password, // Store the password
      token, // Keep token for reference (one-time use)
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      access_expires_at: calculateAccessExpiration(tokenRecord.access_duration_months),
      current_token_id: tokenRecord.id
    };
    
    mockUsers.push(newUser);
    
    // Mark token as used (one-time use)
    tokenRecord.user_id = newUser.id;
    tokenRecord.status = 'used';
    
    return {
      success: true,
      token: 'mock-user-token',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: newUser.token,
        status: newUser.status
      }
    };
  },

  // Admin Functions
  generateToken: async (adminToken: string, durationMonths: number = 3) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    const newToken: MockToken = {
      id: `token-${Date.now()}`,
      token: Math.random().toString(36).substring(2, 14).toUpperCase(),
      user_id: null,
      created_by: 'admin-1',
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      access_duration_months: durationMonths
    };
    
    mockTokens.push(newToken);
    
    return {
      success: true,
      token: newToken.token,
      duration_months: durationMonths
    };
  },

  getTokens: async (adminToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    return {
      success: true,
      tokens: mockTokens
    };
  },

  deleteToken: async (adminToken: string, tokenId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    const token = mockTokens.find(t => t.id === tokenId);
    if (token) {
      token.status = 'expired';
    }
    
    return {
      success: true
    };
  },

  getUsers: async (adminToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    return {
      success: true,
      users: mockUsers
    };
  },

  updateUserStatus: async (adminToken: string, userId: string, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = status as 'active' | 'paused' | 'deleted' | 'expired';
    }
    
    return {
      success: true
    };
  },

  // Renew user access with a new token
  renewUserAccess: async (adminToken: string, userId: string, newTokenId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (adminToken !== 'mock-admin-token') {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }
    
    const user = mockUsers.find(u => u.id === userId);
    const token = mockTokens.find(t => t.id === newTokenId && t.status === 'active');
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    if (!token) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }
    
    // Update user access
    user.status = 'active';
    user.access_expires_at = calculateAccessExpiration(token.access_duration_months);
    user.current_token_id = token.id;
    user.last_login = new Date().toISOString();
    
    // Mark token as used
    token.user_id = userId;
    token.status = 'used';
    
    return {
      success: true,
      message: `User access renewed for ${token.access_duration_months} months`,
      expires_at: user.access_expires_at
    };
  }
};

// Export mock data for debugging
export const getMockData = () => ({
  users: mockUsers,
  tokens: mockTokens
});

// Reset mock data
export const resetMockData = () => {
  mockUsers = [];
  mockTokens = [
    {
      id: '1',
      token: 'DEMO12345678',
      user_id: null,
      created_by: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      access_duration_months: 3
    }
  ];
};

