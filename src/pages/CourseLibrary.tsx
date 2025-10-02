import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  User, 
  DollarSign, 
  Star, 
  Lock, 
  Unlock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseCategory } from '@/lib/course-database';

const CourseLibrary = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, priceFilter]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/courses/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(course => !course.is_paid);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(course => course.is_paid);
    }

    setFilteredCourses(filtered);
  };

  const openCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleEnroll = (course: Course) => {
    if (course.is_paid) {
      // Redirect to payment page
      navigate(`/payment/${course.id}`);
    } else {
      // Enroll in free course
      navigate(`/course/${course.id}`);
    }
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
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold gradient-text">TradeMaster Academy</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Course <span className="gradient-text">Library</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Master trading with our comprehensive collection of free and premium courses
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all courses
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setPriceFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
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
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
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
                            Free
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCourseDetails(course)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(course)}
                        >
                          {course.is_paid ? 'Enroll' : 'Start Free'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Course Details Modal */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                    {selectedCourse.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedCourse.category}</Badge>
                  {selectedCourse.is_paid ? (
                    <Badge variant="default" className="bg-primary">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {selectedCourse.price} {selectedCourse.currency}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Unlock className="h-3 w-3 mr-1" />
                      Free
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {selectedCourse.thumbnail_url && (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-lg overflow-hidden">
                    <img
                      src={selectedCourse.thumbnail_url}
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">About this course</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">{formatDuration(selectedCourse.duration_hours)}</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <User className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Instructor</div>
                    <div className="font-semibold">{selectedCourse.instructor_name}</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Level</div>
                    <div className="font-semibold capitalize">{selectedCourse.difficulty}</div>
                  </div>
                  <div className="text-center p-4 bg-background-secondary rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-semibold">{selectedCourse.category}</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setShowCourseModal(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEnroll(selectedCourse)}>
                    {selectedCourse.is_paid ? 'Enroll Now' : 'Start Free Course'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseLibrary;
