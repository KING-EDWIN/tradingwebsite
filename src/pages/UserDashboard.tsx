import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  User, 
  DollarSign, 
  Lock, 
  Unlock,
  TrendingUp,
  LogOut,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/lib/course-database';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId,
        email: payload.email,
        name: payload.name
      });
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('userToken');
      navigate('/');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.success && data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">TradeMaster Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome back, {user?.name || 'Student'}!</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Continue your trading journey with our comprehensive course library
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: "Available Courses", value: courses.length.toString(), color: "text-primary" },
              { icon: Unlock, label: "Free Courses", value: courses.filter(c => !c.is_paid).length.toString(), color: "text-green-600" },
              { icon: Lock, label: "Premium Courses", value: courses.filter(c => c.is_paid).length.toString(), color: "text-yellow-600" },
              { icon: User, label: "Your Progress", value: "0%", color: "text-blue-600" }
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
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Your <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Access your free courses and explore premium options
            </p>
          </div>

          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    {course.thumbnail_url && (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-t-lg overflow-hidden">
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                      {course.is_paid ? (
                        <Badge variant="default" className="bg-primary">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Unlock className="h-3 w-3 mr-1" />
                          Free
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(course.duration_hours)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{course.instructor_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {course.is_paid ? (
                          <div className="text-lg font-bold text-primary">
                            {course.price} {course.currency}
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-green-600">
                            Free Access
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {course.is_paid ? (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Purchase
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Start Course
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold mb-2">No courses available yet</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for amazing trading courses!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
