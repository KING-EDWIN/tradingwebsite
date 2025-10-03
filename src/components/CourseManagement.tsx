import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Play, Eye, EyeOff, DollarSign, Clock, User, Video, ExternalLink } from 'lucide-react';
import { Course, CourseVideo, CourseCategory } from '@/lib/course-database';

interface CourseManagementProps {
  adminId: string;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ adminId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingVideo, setEditingVideo] = useState<CourseVideo | null>(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    currency: 'USD',
    is_paid: false,
    duration_hours: 0,
    instructor_name: '',
    instructor_avatar: '',
    status: 'active' as 'active' | 'inactive' | 'draft'
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration: 0,
    order_index: 0,
    is_preview: false,
    thumbnail_url: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

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
      const response = await fetch('/api/courses?action=categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourseVideos = async (courseId: string) => {
    try {
      const response = await fetch(`/api/videos?course_id=${courseId}`);
      const data = await response.json();
      if (data.success) {
        setCourseVideos(data.videos);
      }
    } catch (error) {
      console.error('Error fetching course videos:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseForm,
          created_by: adminId
        })
      });

      const data = await response.json();
      if (data.success) {
        setCourses([...courses, data.course]);
        setShowCourseDialog(false);
        resetCourseForm();
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const response = await fetch(`/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      });

      const data = await response.json();
      if (data.success) {
        setCourses(courses.map(c => c.id === editingCourse.id ? data.course : c));
        setShowCourseDialog(false);
        setEditingCourse(null);
        resetCourseForm();
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleAddVideo = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...videoForm,
          course_id: selectedCourse.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setCourseVideos([...courseVideos, data.video]);
        setShowVideoDialog(false);
        resetVideoForm();
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    try {
      const response = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingVideo.id,
          ...videoForm
        })
      });

      const data = await response.json();
      if (data.success) {
        setCourseVideos(courseVideos.map(v => v.id === editingVideo.id ? data.video : v));
        setShowVideoDialog(false);
        setEditingVideo(null);
        resetVideoForm();
      }
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/videos?id=${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCourseVideos(courseVideos.filter(v => v.id !== videoId));
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      thumbnail_url: '',
      category: '',
      difficulty: 'beginner',
      price: 0,
      currency: 'USD',
      is_paid: false,
      duration_hours: 0,
      instructor_name: '',
      instructor_avatar: '',
      status: 'active'
    });
  };

  const resetVideoForm = () => {
    setVideoForm({
      title: '',
      description: '',
      video_url: '',
      duration: 0,
      order_index: 0,
      is_preview: false,
      thumbnail_url: ''
    });
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      category: course.category,
      difficulty: course.difficulty,
      price: course.price,
      currency: course.currency,
      is_paid: course.is_paid,
      duration_hours: course.duration_hours,
      instructor_name: course.instructor_name,
      instructor_avatar: course.instructor_avatar,
      status: course.status
    });
    setShowCourseDialog(true);
  };

  const openEditVideo = (video: CourseVideo) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      duration: video.duration,
      order_index: video.order_index,
      is_preview: video.is_preview,
      thumbnail_url: video.thumbnail_url
    });
    setShowVideoDialog(true);
  };

  const openCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseVideos(course.id);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading courses...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCourse(null); resetCourseForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="Course title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={courseForm.category} onValueChange={(value) => setCourseForm({ ...courseForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={courseForm.difficulty} onValueChange={(value: any) => setCourseForm({ ...courseForm, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (hours)</label>
                  <Input
                    type="number"
                    value={courseForm.duration_hours}
                    onChange={(e) => setCourseForm({ ...courseForm, duration_hours: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={courseForm.status} onValueChange={(value: any) => setCourseForm({ ...courseForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Instructor Name</label>
                  <Input
                    value={courseForm.instructor_name}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_name: e.target.value })}
                    placeholder="Instructor name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Instructor Avatar URL</label>
                  <Input
                    value={courseForm.instructor_avatar}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_avatar: e.target.value })}
                    placeholder="Avatar URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Thumbnail URL</label>
                  <Input
                    value={courseForm.thumbnail_url}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail_url: e.target.value })}
                    placeholder="Thumbnail URL"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={courseForm.is_paid}
                      onChange={(e) => setCourseForm({ ...courseForm, is_paid: e.target.checked })}
                    />
                    <span className="text-sm font-medium">Paid Course</span>
                  </label>
                </div>
              </div>

              {courseForm.is_paid && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      type="number"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <Select value={courseForm.currency} onValueChange={(value) => setCourseForm({ ...courseForm, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          {selectedCourse && (
            <TabsTrigger value="videos">
              Videos - {selectedCourse.title}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={course.is_paid ? "default" : "secondary"}>
                          {course.is_paid ? (
                            <><DollarSign className="h-3 w-3 mr-1" /> Paid</>
                          ) : (
                            'Free'
                          )}
                        </Badge>
                        <Badge variant="outline">{course.difficulty}</Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openCourseDetails(course)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_hours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{course.instructor_name}</span>
                      </div>
                    </div>
                    {course.is_paid && (
                      <div className="font-semibold">
                        {course.price} {course.currency}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {selectedCourse && (
          <TabsContent value="videos">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Course Videos</h3>
                <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingVideo(null); resetVideoForm(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingVideo ? 'Edit Video' : 'Add Video to Course'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Video Title</label>
                        <Input
                          value={videoForm.title}
                          onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                          placeholder="Video title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Video URL (YouTube or direct)</label>
                        <Input
                          value={videoForm.video_url}
                          onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={videoForm.description}
                          onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                          placeholder="Video description"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Duration (seconds)</label>
                          <Input
                            type="number"
                            value={videoForm.duration}
                            onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Order Index</label>
                          <Input
                            type="number"
                            value={videoForm.order_index}
                            onChange={(e) => setVideoForm({ ...videoForm, order_index: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Thumbnail URL</label>
                        <Input
                          value={videoForm.thumbnail_url}
                          onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                          placeholder="Thumbnail URL"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_preview"
                          checked={videoForm.is_preview}
                          onChange={(e) => setVideoForm({ ...videoForm, is_preview: e.target.checked })}
                        />
                        <label htmlFor="is_preview" className="text-sm font-medium">
                          Preview video (can be watched without payment)
                        </label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingVideo ? handleUpdateVideo : handleAddVideo}>
                          {editingVideo ? 'Update Video' : 'Add Video'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {courseVideos.map((video, index) => (
                  <Card key={video.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {video.order_index + 1}.
                            </span>
                            <Play className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                              {video.is_preview && (
                                <Badge variant="outline" className="ml-2">
                                  Preview
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {video.youtube_id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(video.video_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditVideo(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CourseManagement;
