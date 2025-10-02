import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import TradingSimulator from "@/components/TradingSimulator";
import VideoLibrary from "@/components/VideoLibrary";
import { 
  TrendingUp, 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen,
  BarChart3,
  Target,
  Award,
  Shield,
  Activity
} from "lucide-react";

// Mock data for demonstration
const videoLessons = [
  {
    id: 1,
    title: "Introduction to Technical Analysis",
    duration: "45:20",
    difficulty: "Beginner",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/00d4ff?text=Technical+Analysis",
    progress: 100,
    category: "Fundamentals"
  },
  {
    id: 2,
    title: "Candlestick Patterns Mastery",
    duration: "62:15",
    difficulty: "Intermediate",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/00ff88?text=Candlestick+Patterns",
    progress: 65,
    category: "Technical Analysis"
  },
  {
    id: 3,
    title: "Risk Management Strategies",
    duration: "38:45",
    difficulty: "Advanced",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/ff6b6b?text=Risk+Management",
    progress: 0,
    category: "Risk Management"
  },
  {
    id: 4,
    title: "Options Trading Fundamentals",
    duration: "71:30",
    difficulty: "Intermediate",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/ffd93d?text=Options+Trading",
    progress: 25,
    category: "Options"
  },
  {
    id: 5,
    title: "Market Psychology & Sentiment",
    duration: "55:10",
    difficulty: "Advanced",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/a8e6cf?text=Market+Psychology",
    progress: 0,
    category: "Psychology"
  },
  {
    id: 6,
    title: "Algorithmic Trading Basics",
    duration: "89:25",
    difficulty: "Advanced",
    thumbnail: "https://via.placeholder.com/320x180/1a1a2e/ff8b94?text=Algorithmic+Trading",
    progress: 0,
    category: "Advanced"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">TradeMaster</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome back, John</span>
            <Button variant="outline" size="sm">Profile</Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="text-warning hover:text-warning"
            >
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Continue your trading education journey</p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Video Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Trading Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Video Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <VideoLibrary />
          </TabsContent>

          {/* Trading Simulator Tab */}
          <TabsContent value="simulator">
            <TradingSimulator />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Progress */}
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Learning Progress
                </h3>
                <div className="space-y-4">
                  {[
                    { category: "Fundamentals", progress: 80 },
                    { category: "Technical Analysis", progress: 45 },
                    { category: "Risk Management", progress: 20 },
                    { category: "Options", progress: 15 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.category}</span>
                        <span className="text-muted-foreground">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Download Resources
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Practice Tests
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;