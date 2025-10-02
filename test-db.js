// Simple test script to verify database connection
// Run with: node test-db.js

const { sql } = require('@vercel/postgres');

async function testConnection() {
  try {
    console.log('Testing Vercel Postgres connection...');
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Test table creation
    console.log('\nTesting table creation...');
    await sql`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Test table created successfully');
    
    // Test insert
    await sql`
      INSERT INTO test_table (message) 
      VALUES ('Hello from Vercel Postgres!')
    `;
    console.log('✅ Test data inserted successfully');
    
    // Test select
    const testResult = await sql`SELECT * FROM test_table ORDER BY created_at DESC LIMIT 1`;
    console.log('✅ Test data retrieved:', testResult.rows[0]);
    
    // Clean up
    await sql`DROP TABLE test_table`;
    console.log('✅ Test table cleaned up');
    
    console.log('\n🎉 All database tests passed! Your Vercel Postgres is working correctly.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Make sure you have set up your environment variables correctly.');
    process.exit(1);
  }
}

testConnection();
