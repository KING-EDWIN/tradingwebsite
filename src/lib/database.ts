import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  status: 'active' | 'paused' | 'deleted';
  created_at: string;
  updated_at: string;
  last_login: string | null;
  expires_at: string | null;
}

export interface Token {
  id: string;
  token: string;
  user_id: string | null;
  created_by: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string | null;
}

export interface SuperAdmin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  duration: number | null;
  thumbnail_url: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create super admin table
    await sql`
      CREATE TABLE IF NOT EXISTS super_admins (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `;

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        token VARCHAR(36) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        expires_at TIMESTAMP
      )
    `;

    // Create tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS tokens (
        id VARCHAR(36) PRIMARY KEY,
        token VARCHAR(36) UNIQUE NOT NULL,
        user_id VARCHAR(36),
        created_by VARCHAR(36) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES super_admins(id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `;

    // Create super admin user if not exists
    const existingAdmin = await sql`
      SELECT id FROM super_admins WHERE email = 'damanifesta0@gmail.com'
    `;

    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('KINg178.', 12);
      await sql`
        INSERT INTO super_admins (id, email, password_hash)
        VALUES (${uuidv4()}, 'damanifesta0@gmail.com', ${hashedPassword})
      `;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Super Admin functions
export async function authenticateSuperAdmin(email: string, password: string): Promise<SuperAdmin | null> {
  try {
    const result = await sql`
      SELECT * FROM super_admins WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const admin = result.rows[0] as SuperAdmin;
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return null;
    }

    // Update last login
    await sql`
      UPDATE super_admins 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${admin.id}
    `;

    return admin;
  } catch (error) {
    console.error('Error authenticating super admin:', error);
    return null;
  }
}

// Token functions
export async function generateToken(createdBy: string): Promise<string> {
  try {
    const token = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
    
    await sql`
      INSERT INTO tokens (id, token, created_by, expires_at)
      VALUES (${uuidv4()}, ${token}, ${createdBy}, CURRENT_TIMESTAMP + INTERVAL '1 year')
    `;

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

export async function validateToken(token: string): Promise<Token | null> {
  try {
    const result = await sql`
      SELECT * FROM tokens 
      WHERE token = ${token} 
      AND status = 'active' 
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;

    return result.rows.length > 0 ? result.rows[0] as Token : null;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export async function useToken(token: string, userData: { email: string; name: string }): Promise<User | null> {
  try {
    const tokenRecord = await validateToken(token);
    if (!tokenRecord) {
      return null;
    }

    // Create user
    const userId = uuidv4();
    await sql`
      INSERT INTO users (id, email, name, token, expires_at)
      VALUES (${userId}, ${userData.email}, ${userData.name}, ${token}, CURRENT_TIMESTAMP + INTERVAL '1 year')
    `;

    // Mark token as used
    await sql`
      UPDATE tokens 
      SET user_id = ${userId}, status = 'used' 
      WHERE id = ${tokenRecord.id}
    `;

    // Get created user
    const userResult = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    return userResult.rows[0] as User;
  } catch (error) {
    console.error('Error using token:', error);
    return null;
  }
}

// User functions
export async function authenticateUser(token: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE token = ${token} 
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0] as User;

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `;

    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE status != 'deleted'
      ORDER BY created_at DESC
    `;

    return result.rows as User[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

export async function updateUserStatus(userId: string, status: 'active' | 'paused' | 'deleted'): Promise<boolean> {
  try {
    await sql`
      UPDATE users 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId}
    `;

    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    return false;
  }
}

export async function getAllTokens(): Promise<Token[]> {
  try {
    const result = await sql`
      SELECT t.*, sa.email as created_by_email
      FROM tokens t
      LEFT JOIN super_admins sa ON t.created_by = sa.id
      ORDER BY t.created_at DESC
    `;

    return result.rows as Token[];
  } catch (error) {
    console.error('Error getting all tokens:', error);
    return [];
  }
}

export async function deleteToken(tokenId: string): Promise<boolean> {
  try {
    await sql`
      UPDATE tokens 
      SET status = 'expired' 
      WHERE id = ${tokenId}
    `;

    return true;
  } catch (error) {
    console.error('Error deleting token:', error);
    return false;
  }
}

// Video management functions
export async function getAllVideos(): Promise<Video[]> {
  try {
    const result = await sql`
      SELECT * FROM videos 
      WHERE status != 'deleted'
      ORDER BY created_at DESC
    `;

    return result.rows as Video[];
  } catch (error) {
    console.error('Error getting all videos:', error);
    return [];
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const result = await sql`
      SELECT * FROM videos 
      WHERE id = ${id} AND status != 'deleted'
    `;

    return result.rows.length > 0 ? result.rows[0] as Video : null;
  } catch (error) {
    console.error('Error getting video by id:', error);
    return null;
  }
}

export async function createVideo(videoData: {
  title: string;
  description?: string;
  url: string;
  category?: string;
  duration?: number;
  thumbnail_url?: string;
}): Promise<Video | null> {
  try {
    const videoId = uuidv4();
    await sql`
      INSERT INTO videos (id, title, description, url, category, duration, thumbnail_url)
      VALUES (${videoId}, ${videoData.title}, ${videoData.description || null}, ${videoData.url}, ${videoData.category || null}, ${videoData.duration || null}, ${videoData.thumbnail_url || null})
    `;

    const result = await sql`
      SELECT * FROM videos WHERE id = ${videoId}
    `;

    return result.rows[0] as Video;
  } catch (error) {
    console.error('Error creating video:', error);
    return null;
  }
}

export async function updateVideo(id: string, videoData: {
  title?: string;
  description?: string;
  url?: string;
  category?: string;
  duration?: number;
  thumbnail_url?: string;
  status?: 'active' | 'inactive' | 'deleted';
}): Promise<Video | null> {
  try {
    const updateFields = [];
    const values = [];

    if (videoData.title !== undefined) {
      updateFields.push('title = $' + (values.length + 1));
      values.push(videoData.title);
    }
    if (videoData.description !== undefined) {
      updateFields.push('description = $' + (values.length + 1));
      values.push(videoData.description);
    }
    if (videoData.url !== undefined) {
      updateFields.push('url = $' + (values.length + 1));
      values.push(videoData.url);
    }
    if (videoData.category !== undefined) {
      updateFields.push('category = $' + (values.length + 1));
      values.push(videoData.category);
    }
    if (videoData.duration !== undefined) {
      updateFields.push('duration = $' + (values.length + 1));
      values.push(videoData.duration);
    }
    if (videoData.thumbnail_url !== undefined) {
      updateFields.push('thumbnail_url = $' + (values.length + 1));
      values.push(videoData.thumbnail_url);
    }
    if (videoData.status !== undefined) {
      updateFields.push('status = $' + (values.length + 1));
      values.push(videoData.status);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await sql`
      UPDATE videos 
      SET ${sql.unsafe(updateFields.join(', '))}
      WHERE id = $${values.length}
    `;

    const result = await sql`
      SELECT * FROM videos WHERE id = ${id}
    `;

    return result.rows.length > 0 ? result.rows[0] as Video : null;
  } catch (error) {
    console.error('Error updating video:', error);
    return null;
  }
}

export async function deleteVideo(id: string): Promise<boolean> {
  try {
    await sql`
      UPDATE videos 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}

export async function getAllVideoCategories(): Promise<VideoCategory[]> {
  try {
    const result = await sql`
      SELECT * FROM video_categories 
      ORDER BY name ASC
    `;

    return result.rows as VideoCategory[];
  } catch (error) {
    console.error('Error getting video categories:', error);
    return [];
  }
}

export async function createVideoCategory(categoryData: {
  name: string;
  description?: string;
}): Promise<VideoCategory | null> {
  try {
    const categoryId = uuidv4();
    await sql`
      INSERT INTO video_categories (id, name, description)
      VALUES (${categoryId}, ${categoryData.name}, ${categoryData.description || null})
    `;

    const result = await sql`
      SELECT * FROM video_categories WHERE id = ${categoryId}
    `;

    return result.rows[0] as VideoCategory;
  } catch (error) {
    console.error('Error creating video category:', error);
    return null;
  }
}



