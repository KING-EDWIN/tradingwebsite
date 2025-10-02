const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initialize database tables for trading website
async function initializeDatabase() {
  try {
    console.log('Initializing Vercel Postgres database for trading website...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 10000.00,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create trades table
    await sql`
      CREATE TABLE IF NOT EXISTS trades (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
        quantity DECIMAL(15,8) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // Create portfolio table
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        quantity DECIMAL(15,8) NOT NULL,
        average_price DECIMAL(15,2) NOT NULL,
        current_price DECIMAL(15,2),
        total_value DECIMAL(15,2),
        profit_loss DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, symbol)
      )
    `;

    // Create market_data table for storing real-time prices
    await sql`
      CREATE TABLE IF NOT EXISTS market_data (
        id VARCHAR(36) PRIMARY KEY,
        symbol VARCHAR(20) UNIQUE NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        change_percent DECIMAL(8,4),
        volume BIGINT,
        market_cap DECIMAL(20,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `;

    // Create videos table for video management
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        youtube_url VARCHAR(500) NOT NULL,
        youtube_id VARCHAR(20) NOT NULL,
        thumbnail_url VARCHAR(500),
        duration INTEGER,
        category VARCHAR(100),
        difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
        is_private BOOLEAN DEFAULT false,
        uploaded_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
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

    // Create user_video_progress table for tracking user progress
    await sql`
      CREATE TABLE IF NOT EXISTS user_video_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        video_id VARCHAR(36) NOT NULL,
        watched_duration INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT false,
        last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
        UNIQUE(user_id, video_id)
      )
    `;

    // Create default admin user if not exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = 'admin@tradingplatform.com'
    `;

    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await sql`
        INSERT INTO admin_users (id, email, password_hash)
        VALUES (${uuidv4()}, 'admin@tradingplatform.com', ${hashedPassword})
      `;
      console.log('Default admin user created: admin@tradingplatform.com / admin123');
    }

    // Insert sample market data
    const existingMarketData = await sql`
      SELECT id FROM market_data WHERE symbol = 'BTC'
    `;

    if (existingMarketData.rows.length === 0) {
      await sql`
        INSERT INTO market_data (id, symbol, price, change_percent, volume, market_cap)
        VALUES 
          (${uuidv4()}, 'BTC', 45000.00, 2.5, 25000000000, 850000000000),
          (${uuidv4()}, 'ETH', 3200.00, 1.8, 15000000000, 380000000000),
          (${uuidv4()}, 'AAPL', 175.50, -0.5, 50000000, 2800000000000),
          (${uuidv4()}, 'GOOGL', 140.25, 1.2, 25000000, 1800000000000),
          (${uuidv4()}, 'TSLA', 250.75, 3.2, 80000000, 800000000000)
      `;
      console.log('Sample market data inserted');
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
          (${uuidv4()}, 'Psychology', 'Trading mindset and emotional control'),
          (${uuidv4()}, 'Cryptocurrency', 'Digital asset trading strategies'),
          (${uuidv4()}, 'Stock Market', 'Equity trading and analysis'),
          (${uuidv4()}, 'Forex Trading', 'Foreign exchange trading'),
          (${uuidv4()}, 'Options Trading', 'Options strategies and derivatives')
      `;
      console.log('Default video categories created');
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Test database connection
async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = {
  initializeDatabase,
  testDatabaseConnection
};
