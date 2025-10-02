import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initializeCourseTables } from './course-database';

// Initialize database tables for Vercel Postgres
export async function initializeDatabase() {
  try {
    console.log('Initializing Vercel Postgres database...');

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

    // Create videos table for video management
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        duration INTEGER,
        thumbnail_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create video categories table
    await sql`
      CREATE TABLE IF NOT EXISTS video_categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
      console.log('Super admin user created');
    }

    // Insert default video categories
    const existingCategories = await sql`
      SELECT id FROM video_categories WHERE name = 'Trading Basics'
    `;

    if (existingCategories.rows.length === 0) {
      await sql`
        INSERT INTO video_categories (id, name, description)
        VALUES 
          (${uuidv4()}, 'Trading Basics', 'Fundamental trading concepts and strategies'),
          (${uuidv4()}, 'Technical Analysis', 'Charts, indicators, and technical patterns'),
          (${uuidv4()}, 'Risk Management', 'Position sizing, stop losses, and risk control'),
          (${uuidv4()}, 'Psychology', 'Trading mindset and emotional control')
      `;
      console.log('Default video categories created');
    }

    // Initialize course tables
    await initializeCourseTables();

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}