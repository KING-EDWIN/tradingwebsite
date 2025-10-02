import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManagement from "@/components/ContentManagement";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Calendar,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3
} from "lucide-react";

// Mock data for admin dashboard
const usersList = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-15",
    expiryDate: "2024-04-15",
    status: "active",
    lastLogin: "2024-01-20",
    lessonsCompleted: 12
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    joinDate: "2024-01-10",
    expiryDate: "2024-01-25",
    status: "expiring",
    lastLogin: "2024-01-18",
    lessonsCompleted: 8
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2023-11-01",
    expiryDate: "2024-01-01",
    status: "expired",
    lastLogin: "2023-12-28",
    lessonsCompleted: 25
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    joinDate: "2024-01-05",
    expiryDate: "2024-04-05",
    status: "active",
    lastLogin: "2024-01-19",
    lessonsCompleted: 5
  }
];

const AdminDashboard = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case "expiring":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Expiring Soon</Badge>;
      case "expired":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "expiring":
        return <Clock className="h-4 w-4 text-warning" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">Admin Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Super Admin</span>
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="ghost" size="sm">Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: Users, 
              label: "Total Users", 
              value: "247", 
              change: "+12", 
              color: "text-primary",
              trend: "up" 
            },
            { 
              icon: CheckCircle, 
              label: "Active Users", 
              value: "198", 
              change: "+8", 
              color: "text-success",
              trend: "up" 
            },
            { 
              icon: AlertCircle, 
              label: "Expiring Soon", 
              value: "15", 
              change: "+3", 
              color: "text-warning",
              trend: "up" 
            },
            { 
              icon: Clock, 
              label: "Expired Users", 
              value: "34", 
              change: "-2", 
              color: "text-destructive",
              trend: "down" 
            }
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} this week
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Content Management</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-card">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-display font-semibold">User Management</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button variant="hero" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4 font-medium text-muted-foreground">User</th>
                  <th className="p-4 font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-medium text-muted-foreground">Access Period</th>
                  <th className="p-4 font-medium text-muted-foreground">Progress</th>
                  <th className="p-4 font-medium text-muted-foreground">Last Login</th>
                  <th className="p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        {getStatusBadge(user.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Started: {user.joinDate}</div>
                        <div className={`${user.status === 'expired' ? 'text-destructive' : user.status === 'expiring' ? 'text-warning' : 'text-muted-foreground'}`}>
                          Expires: {user.expiryDate}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{user.lessonsCompleted} lessons</div>
                        <div className="w-16 bg-muted rounded-full h-1 mt-1">
                          <div 
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${Math.min((user.lessonsCompleted / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.lastLogin}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant={user.status === 'expired' ? 'success' : 'outline'} 
                          size="sm"
                        >
                          {user.status === 'expired' ? 'Extend' : 'Manage'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing 4 of 247 users
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="glass-card p-6 hover-lift cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Bulk Add Users</h3>
                <p className="text-sm text-muted-foreground">Import users from CSV</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover-lift cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Extend Access</h3>
                <p className="text-sm text-muted-foreground">Bulk extend user access</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover-lift cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Send Reminders</h3>
                <p className="text-sm text-muted-foreground">Notify expiring users</p>
              </div>
            </div>
          </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-semibold">$45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Active Users</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Course Completion Rate</span>
                    <span className="font-semibold">73%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Session Duration</span>
                    <span className="font-semibold">28 min</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Most Popular Course</span>
                    <span className="font-semibold">Technical Analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Video Views</span>
                    <span className="font-semibold">15,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Content This Month</span>
                    <span className="font-semibold">8 lessons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Engagement Score</span>
                    <span className="font-semibold">8.7/10</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;