const { sql } = require('@vercel/postgres');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM video_categories 
        ORDER BY name ASC
      `;

      res.status(200).json({
        success: true,
        categories: result.rows
      });
    } catch (error) {
      console.error('Error fetching video categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch video categories',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Category name is required'
        });
      }

      const categoryId = uuidv4();
      await sql`
        INSERT INTO video_categories (id, name, description)
        VALUES (${categoryId}, ${name}, ${description || null})
      `;

      const result = await sql`
        SELECT * FROM video_categories WHERE id = ${categoryId}
      `;

      res.status(201).json({
        success: true,
        category: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating video category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create video category',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

