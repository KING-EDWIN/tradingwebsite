import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

// Course interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number; // 0 for free courses
  currency: string; // 'USD', 'BTC', 'ETH', etc.
  is_paid: boolean;
  duration_hours: number;
  instructor_name: string;
  instructor_avatar: string;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  created_by: string; // admin user id
}

export interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string; // YouTube URL or direct video URL
  youtube_id: string; // extracted from YouTube URL
  duration: number; // in seconds
  order_index: number; // for ordering videos in course
  is_preview: boolean; // if true, can be watched without payment
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourseAccess {
  id: string;
  user_id: string;
  course_id: string;
  access_type: 'free' | 'paid';
  payment_tx_hash?: string; // crypto transaction hash
  access_granted_at: string;
  expires_at?: string; // for time-limited access
  status: 'active' | 'expired' | 'revoked';
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  color: string; // hex color for UI
  created_at: string;
}

// Initialize course-related tables
export async function initializeCourseTables() {
  try {
    console.log('Initializing course tables...');

    // Create course categories table
    await sql`
      CREATE TABLE IF NOT EXISTS course_categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#00d4ff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create courses table
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        thumbnail_url VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        price DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        is_paid BOOLEAN DEFAULT false,
        duration_hours DECIMAL(5,2) DEFAULT 0,
        instructor_name VARCHAR(255) NOT NULL,
        instructor_avatar VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(36) NOT NULL,
        FOREIGN KEY (created_by) REFERENCES super_admins(id) ON DELETE CASCADE
      )
    `;

    // Create course videos table
    await sql`
      CREATE TABLE IF NOT EXISTS course_videos (
        id VARCHAR(36) PRIMARY KEY,
        course_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url VARCHAR(500) NOT NULL,
        youtube_id VARCHAR(20),
        duration INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        is_preview BOOLEAN DEFAULT false,
        thumbnail_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `;

    // Create user course access table
    await sql`
      CREATE TABLE IF NOT EXISTS user_course_access (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        access_type VARCHAR(10) DEFAULT 'free' CHECK (access_type IN ('free', 'paid')),
        payment_tx_hash VARCHAR(100),
        access_granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(user_id, course_id)
      )
    `;

    // Create course progress table
    await sql`
      CREATE TABLE IF NOT EXISTS course_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        video_id VARCHAR(36) NOT NULL,
        watched_duration INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT false,
        last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES course_videos(id) ON DELETE CASCADE,
        UNIQUE(user_id, video_id)
      )
    `;

    // Insert default course categories
    const existingCategories = await sql`
      SELECT id FROM course_categories WHERE name = 'Trading Basics'
    `;

    if (existingCategories.rows.length === 0) {
      await sql`
        INSERT INTO course_categories (id, name, description, color)
        VALUES 
          (${uuidv4()}, 'Trading Basics', 'Fundamental trading concepts and strategies', '#00d4ff'),
          (${uuidv4()}, 'Technical Analysis', 'Charts, indicators, and technical patterns', '#ff6b6b'),
          (${uuidv4()}, 'Risk Management', 'Position sizing, stop losses, and risk control', '#4ade80'),
          (${uuidv4()}, 'Psychology', 'Trading mindset and emotional control', '#fbbf24'),
          (${uuidv4()}, 'Cryptocurrency', 'Digital asset trading strategies', '#8b5cf6'),
          (${uuidv4()}, 'Stock Market', 'Equity trading and analysis', '#06b6d4'),
          (${uuidv4()}, 'Forex Trading', 'Foreign exchange trading', '#10b981'),
          (${uuidv4()}, 'Options Trading', 'Options strategies and derivatives', '#f59e0b')
      `;
      console.log('Default course categories created');
    }

    console.log('Course tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing course tables:', error);
    throw error;
  }
}

// Course CRUD operations
export async function getAllCourses(): Promise<Course[]> {
  try {
    const result = await sql`
      SELECT c.*, cc.color as category_color
      FROM courses c
      LEFT JOIN course_categories cc ON c.category = cc.name
      WHERE c.status = 'active'
      ORDER BY c.created_at DESC
    `;
    return result.rows as Course[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const result = await sql`
      SELECT c.*, cc.color as category_color
      FROM courses c
      LEFT JOIN course_categories cc ON c.category = cc.name
      WHERE c.id = ${id}
    `;
    return result.rows[0] as Course || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course | null> {
  try {
    const id = uuidv4();
    const result = await sql`
      INSERT INTO courses (id, title, description, thumbnail_url, category, difficulty, price, currency, is_paid, duration_hours, instructor_name, instructor_avatar, status, created_by)
      VALUES (${id}, ${courseData.title}, ${courseData.description}, ${courseData.thumbnail_url}, ${courseData.category}, ${courseData.difficulty}, ${courseData.price}, ${courseData.currency}, ${courseData.is_paid}, ${courseData.duration_hours}, ${courseData.instructor_name}, ${courseData.instructor_avatar}, ${courseData.status}, ${courseData.created_by})
      RETURNING *
    `;
    return result.rows[0] as Course;
  } catch (error) {
    console.error('Error creating course:', error);
    return null;
  }
}

export async function updateCourse(id: string, courseData: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course | null> {
  try {
    const result = await sql`
      UPDATE courses 
      SET title = COALESCE(${courseData.title}, title),
          description = COALESCE(${courseData.description}, description),
          thumbnail_url = COALESCE(${courseData.thumbnail_url}, thumbnail_url),
          category = COALESCE(${courseData.category}, category),
          difficulty = COALESCE(${courseData.difficulty}, difficulty),
          price = COALESCE(${courseData.price}, price),
          currency = COALESCE(${courseData.currency}, currency),
          is_paid = COALESCE(${courseData.is_paid}, is_paid),
          duration_hours = COALESCE(${courseData.duration_hours}, duration_hours),
          instructor_name = COALESCE(${courseData.instructor_name}, instructor_name),
          instructor_avatar = COALESCE(${courseData.instructor_avatar}, instructor_avatar),
          status = COALESCE(${courseData.status}, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0] as Course || null;
  } catch (error) {
    console.error('Error updating course:', error);
    return null;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM courses WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
}

// Course video operations
export async function getCourseVideos(courseId: string): Promise<CourseVideo[]> {
  try {
    const result = await sql`
      SELECT * FROM course_videos 
      WHERE course_id = ${courseId}
      ORDER BY order_index ASC
    `;
    return result.rows as CourseVideo[];
  } catch (error) {
    console.error('Error fetching course videos:', error);
    return [];
  }
}

export async function addVideoToCourse(videoData: Omit<CourseVideo, 'id' | 'created_at' | 'updated_at'>): Promise<CourseVideo | null> {
  try {
    const id = uuidv4();
    const result = await sql`
      INSERT INTO course_videos (id, course_id, title, description, video_url, youtube_id, duration, order_index, is_preview, thumbnail_url)
      VALUES (${id}, ${videoData.course_id}, ${videoData.title}, ${videoData.description}, ${videoData.video_url}, ${videoData.youtube_id}, ${videoData.duration}, ${videoData.order_index}, ${videoData.is_preview}, ${videoData.thumbnail_url})
      RETURNING *
    `;
    return result.rows[0] as CourseVideo;
  } catch (error) {
    console.error('Error adding video to course:', error);
    return null;
  }
}

export async function updateCourseVideo(id: string, videoData: Partial<Omit<CourseVideo, 'id' | 'created_at' | 'updated_at'>>): Promise<CourseVideo | null> {
  try {
    const result = await sql`
      UPDATE course_videos 
      SET title = COALESCE(${videoData.title}, title),
          description = COALESCE(${videoData.description}, description),
          video_url = COALESCE(${videoData.video_url}, video_url),
          youtube_id = COALESCE(${videoData.youtube_id}, youtube_id),
          duration = COALESCE(${videoData.duration}, duration),
          order_index = COALESCE(${videoData.order_index}, order_index),
          is_preview = COALESCE(${videoData.is_preview}, is_preview),
          thumbnail_url = COALESCE(${videoData.thumbnail_url}, thumbnail_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0] as CourseVideo || null;
  } catch (error) {
    console.error('Error updating course video:', error);
    return null;
  }
}

export async function deleteCourseVideo(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM course_videos WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting course video:', error);
    return false;
  }
}

// User access control
export async function checkUserCourseAccess(userId: string, courseId: string): Promise<boolean> {
  try {
    // Check if course is free
    const course = await getCourseById(courseId);
    if (!course) return false;
    
    if (!course.is_paid) return true; // Free course, always accessible
    
    // Check if user has paid access
    const result = await sql`
      SELECT * FROM user_course_access 
      WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking course access:', error);
    return false;
  }
}

export async function grantCourseAccess(userId: string, courseId: string, accessType: 'free' | 'paid', paymentTxHash?: string, expiresAt?: string): Promise<boolean> {
  try {
    const id = uuidv4();
    await sql`
      INSERT INTO user_course_access (id, user_id, course_id, access_type, payment_tx_hash, expires_at)
      VALUES (${id}, ${userId}, ${courseId}, ${accessType}, ${paymentTxHash}, ${expiresAt})
      ON CONFLICT (user_id, course_id) 
      DO UPDATE SET 
        access_type = EXCLUDED.access_type,
        payment_tx_hash = EXCLUDED.payment_tx_hash,
        expires_at = EXCLUDED.expires_at,
        status = 'active'
    `;
    return true;
  } catch (error) {
    console.error('Error granting course access:', error);
    return false;
  }
}

// Course categories
export async function getAllCourseCategories(): Promise<CourseCategory[]> {
  try {
    const result = await sql`
      SELECT * FROM course_categories 
      ORDER BY name ASC
    `;
    return result.rows as CourseCategory[];
  } catch (error) {
    console.error('Error fetching course categories:', error);
    return [];
  }
}

// YouTube URL helper
export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
}
