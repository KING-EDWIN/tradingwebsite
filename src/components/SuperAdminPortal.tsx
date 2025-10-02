import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  Key, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Video,
  BookOpen
} from "lucide-react";
import VideoManagement from "./VideoManagement";
import CourseManagement from "./CourseManagement";

interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  status: 'active' | 'paused' | 'deleted' | 'expired';
  created_at: string;
  last_login: string | null;
  access_expires_at: string;
  current_token_id: string;
}

interface Token {
  id: string;
  token: string;
  user_id: string | null;
  created_by: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string | null;
  access_duration_months: number;
  created_by_email?: string;
}

const SuperAdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [showNewToken, setShowNewToken] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Login function
  const handleLogin = async () => {
    try {
      // Use mock API for local development
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.superAdminLogin(loginData.email, loginData.password);

      if (data.success) {
        setIsAuthenticated(true);
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        await loadData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  // Load data functions
  const loadUsers = async () => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.getUsers(adminToken || '');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadTokens = async () => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.getTokens(adminToken || '');
      if (data.success) {
        setTokens(data.tokens);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  const loadData = async () => {
    await Promise.all([loadUsers(), loadTokens()]);
  };

  // Generate new token
  const generateNewToken = async (durationMonths: number = 3) => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.generateToken(adminToken || '', durationMonths);
      if (data.success) {
        setNewToken(data.token);
        setShowNewToken(true);
        await loadTokens();
      }
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  // Renew user access
  const renewUserAccess = async (userId: string, tokenId: string) => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.renewUserAccess(adminToken || '', userId, tokenId);
      if (data.success) {
        alert(data.message);
        await loadUsers();
        await loadTokens();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error renewing access:', error);
      alert('Failed to renew access');
    }
  };

  // Update user status
  const updateUserStatus = async (userId: string, status: 'active' | 'paused' | 'deleted') => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.updateUserStatus(adminToken || '', userId, status);
      if (data.success) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Delete token
  const deleteToken = async (tokenId: string) => {
    try {
      const { mockApi } = await import('@/lib/mock-api');
      const data = await mockApi.deleteToken(adminToken || '', tokenId);
      if (data.success) {
        await loadTokens();
      }
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Check if user access is expired
  const isUserAccessExpired = (user: User): boolean => {
    const now = new Date();
    const expiresAt = new Date(user.access_expires_at);
    return now > expiresAt;
  };

  // Get user status (considering expiration)
  const getUserStatus = (user: User): string => {
    if (isUserAccessExpired(user)) {
      return 'expired';
    }
    return user.status;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case 'paused':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Paused</Badge>;
      case 'deleted':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Deleted</Badge>;
      case 'expired':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Expired</Badge>;
      case 'used':
        return <Badge className="bg-muted/20 text-muted-foreground border-muted/30">Used</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-warning" />;
      case 'deleted':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Check if already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // Load data when token changes
  useEffect(() => {
    if (adminToken) {
      loadData();
    }
  }, [adminToken]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold">Super Admin Portal</h1>
            <p className="text-muted-foreground">Enter your credentials to access</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            <Button onClick={handleLogin} className="w-full">
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">Super Admin Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Super Admin</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsAuthenticated(false);
                setAdminToken(null);
                localStorage.removeItem('adminToken');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and tokens for the trading platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { 
              icon: Users, 
              label: "Total Users", 
              value: users.length.toString(),
              color: "text-primary"
            },
            { 
              icon: CheckCircle, 
              label: "Active Users", 
              value: users.filter(u => getUserStatus(u) === 'active').length.toString(),
              color: "text-success"
            },
            { 
              icon: Pause, 
              label: "Paused Users", 
              value: users.filter(u => getUserStatus(u) === 'paused').length.toString(),
              color: "text-warning"
            },
            { 
              icon: AlertTriangle, 
              label: "Expired Users", 
              value: users.filter(u => getUserStatus(u) === 'expired').length.toString(),
              color: "text-destructive"
            },
            { 
              icon: Key, 
              label: "Active Tokens", 
              value: tokens.filter(t => t.status === 'active').length.toString(),
              color: "text-secondary"
            }
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Token Management</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Course Management</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Video Management</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="glass-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">All Users</h3>
                <div className="space-y-3">
                  {users.map((user) => {
                    const userStatus = getUserStatus(user);
                    const isExpired = isUserAccessExpired(user);
                    const availableTokens = tokens.filter(t => t.status === 'active');
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(user.created_at).toLocaleDateString()}
                              {user.last_login && ` • Last login: ${new Date(user.last_login).toLocaleDateString()}`}
                            </p>
                            <p className={`text-xs ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                              Access expires: {new Date(user.access_expires_at).toLocaleDateString()}
                              {isExpired && ' (EXPIRED)'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(userStatus)}
                            {getStatusBadge(userStatus)}
                          </div>
                          <div className="flex items-center space-x-1">
                            {isExpired && availableTokens.length > 0 && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-success">
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Renew Access</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p>Select a token to renew access for {user.name}:</p>
                                    <div className="space-y-2">
                                      {availableTokens.map((token) => (
                                        <div key={token.id} className="flex items-center justify-between p-2 border rounded">
                                          <div>
                                            <p className="font-mono text-sm">{token.token}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {token.access_duration_months} months access
                                            </p>
                                          </div>
                                          <Button
                                            size="sm"
                                            onClick={() => renewUserAccess(user.id, token.id)}
                                          >
                                            Renew
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user.id, 'active')}
                              disabled={userStatus === 'active'}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user.id, 'paused')}
                              disabled={userStatus === 'paused'}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserStatus(user.id, 'deleted')}
                              disabled={userStatus === 'deleted'}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Token Management</h3>
              <div className="flex items-center space-x-2">
                <Button onClick={() => generateNewToken(1)} variant="outline" size="sm">
                  1 Month
                </Button>
                <Button onClick={() => generateNewToken(3)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>3 Months (Default)</span>
                </Button>
                <Button onClick={() => generateNewToken(6)} variant="outline" size="sm">
                  6 Months
                </Button>
              </div>
            </div>

            <Card className="glass-card">
              <div className="p-6">
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold font-mono">{token.token}</p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(token.created_at).toLocaleDateString()}
                            {token.expires_at && ` • Expires: ${new Date(token.expires_at).toLocaleDateString()}`}
                            <br />
                            <span className="text-success">Grants {token.access_duration_months} months access</span>
                          </p>
                          {token.user_id && (
                            <p className="text-xs text-muted-foreground">
                              Used by: {users.find(u => u.id === token.user_id)?.name || 'Unknown'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(token.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(token.token)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {token.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteToken(token.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <CourseManagement adminId="admin-id" />
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <VideoManagement />
          </TabsContent>
        </Tabs>

        {/* New Token Modal */}
        <Dialog open={showNewToken} onOpenChange={setShowNewToken}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Token Generated</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Copy this token and share it with users:</p>
                <p className="font-mono text-lg font-bold">{newToken}</p>
                <p className="text-sm text-success mt-2">
                  This token grants 3 months of access to the platform
                </p>
              </div>
              <Button 
                onClick={() => copyToClipboard(newToken || '')} 
                className="w-full"
              >
                Copy Token
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SuperAdminPortal;
