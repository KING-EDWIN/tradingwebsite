import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Eye,
  Upload,
  FileText,
  Video,
  BookOpen,
  Target,
  Clock
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  thumbnail: string;
  videoUrl: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  views: number;
  completionRate: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  lessonCount: number;
  color: string;
}

const ContentManagement = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Introduction to Technical Analysis',
      description: 'Learn the fundamentals of technical analysis and chart reading',
      category: 'Fundamentals',
      difficulty: 'beginner',
      duration: '45:20',
      thumbnail: 'https://via.placeholder.com/320x180/1a1a2e/00d4ff?text=Technical+Analysis',
      videoUrl: 'https://example.com/video1',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 1250,
      completionRate: 87
    },
    {
      id: '2',
      title: 'Candlestick Patterns Mastery',
      description: 'Master the art of reading candlestick patterns for better trading decisions',
      category: 'Technical Analysis',
      difficulty: 'intermediate',
      duration: '62:15',
      thumbnail: 'https://via.placeholder.com/320x180/1a1a2e/00ff88?text=Candlestick+Patterns',
      videoUrl: 'https://example.com/video2',
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      views: 980,
      completionRate: 72
    },
    {
      id: '3',
      title: 'Risk Management Strategies',
      description: 'Advanced risk management techniques for professional traders',
      category: 'Risk Management',
      difficulty: 'advanced',
      duration: '38:45',
      thumbnail: 'https://via.placeholder.com/320x180/1a1a2e/ff6b6b?text=Risk+Management',
      videoUrl: 'https://example.com/video3',
      status: 'draft',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22',
      views: 0,
      completionRate: 0
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Fundamentals', description: 'Basic trading concepts', lessonCount: 15, color: 'bg-primary' },
    { id: '2', name: 'Technical Analysis', description: 'Chart patterns and indicators', lessonCount: 25, color: 'bg-secondary' },
    { id: '3', name: 'Risk Management', description: 'Portfolio protection strategies', lessonCount: 10, color: 'bg-warning' },
    { id: '4', name: 'Options', description: 'Options trading strategies', lessonCount: 20, color: 'bg-success' }
  ]);

  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success/20 text-success border-success/30">Published</Badge>;
      case 'draft':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-muted/20 text-muted-foreground border-muted/30">Archived</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="default">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="secondary">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="destructive">Advanced</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === id 
        ? { 
            ...lesson, 
            status: lesson.status === 'published' ? 'draft' : 'published',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : lesson
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage lessons, categories, and course content</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" placeholder="Enter category name" />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea id="categoryDescription" placeholder="Enter category description" />
                </div>
                <Button className="w-full">Create Category</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Lesson</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lessonTitle">Lesson Title</Label>
                    <Input id="lessonTitle" placeholder="Enter lesson title" />
                  </div>
                  <div>
                    <Label htmlFor="lessonCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="lessonDescription">Description</Label>
                  <Textarea id="lessonDescription" placeholder="Enter lesson description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="lessonDifficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lessonDuration">Duration</Label>
                    <Input id="lessonDuration" placeholder="e.g., 45:20" />
                  </div>
                  <div>
                    <Label htmlFor="lessonStatus">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lessonThumbnail">Thumbnail URL</Label>
                    <Input id="lessonThumbnail" placeholder="Enter thumbnail URL" />
                  </div>
                  <div>
                    <Label htmlFor="lessonVideo">Video URL</Label>
                    <Input id="lessonVideo" placeholder="Enter video URL" />
                  </div>
                </div>
                <Button className="w-full">Create Lesson</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
        </TabsList>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="space-y-4">
          <Card className="glass-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">All Lessons</h3>
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={lesson.thumbnail} 
                        alt={lesson.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{lesson.title}</h4>
                          {getStatusBadge(lesson.status)}
                          {getDifficultyBadge(lesson.difficulty)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{lesson.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>{lesson.completionRate}% completion</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(lesson.id)}
                      >
                        {lesson.status === 'published' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card key={category.id} className="glass-card p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 ${category.color} rounded-lg flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.lessonCount} lessons
                  </span>
                  <Badge variant="outline">{category.lessonCount}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;



