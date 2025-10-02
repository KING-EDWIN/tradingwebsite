const { sql } = require('@vercel/postgres');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { user_id, video_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      let query = `
        SELECT uvp.*, v.title, v.youtube_id, v.thumbnail_url, v.duration
        FROM user_video_progress uvp
        JOIN videos v ON uvp.video_id = v.id
        WHERE uvp.user_id = $1
      `;
      
      const values = [user_id];
      let paramCount = 2;

      if (video_id) {
        query += ` AND uvp.video_id = $${paramCount}`;
        values.push(video_id);
        paramCount++;
      }

      query += ` ORDER BY uvp.last_watched DESC`;

      const result = await sql.unsafe(query, values);

      res.status(200).json({
        success: true,
        progress: result.rows.map(row => ({
          id: row.id,
          user_id: row.user_id,
          video_id: row.video_id,
          video_title: row.title,
          youtube_id: row.youtube_id,
          thumbnail_url: row.thumbnail_url,
          duration: row.duration,
          watched_duration: row.watched_duration,
          is_completed: row.is_completed,
          last_watched: row.last_watched,
          created_at: row.created_at
        }))
      });
    } catch (error) {
      console.error('Error fetching video progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch video progress',
        details: error.message
      });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { user_id, video_id, watched_duration, is_completed } = req.body;

      if (!user_id || !video_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID and Video ID are required'
        });
      }

      // Check if progress record exists
      const existing = await sql`
        SELECT id FROM user_video_progress 
        WHERE user_id = ${user_id} AND video_id = ${video_id}
      `;

      if (existing.rows.length > 0) {
        // Update existing progress
        await sql`
          UPDATE user_video_progress 
          SET watched_duration = ${watched_duration || 0},
              is_completed = ${is_completed || false},
              last_watched = CURRENT_TIMESTAMP
          WHERE user_id = ${user_id} AND video_id = ${video_id}
        `;
      } else {
        // Create new progress record
        const progressId = uuidv4();
        await sql`
          INSERT INTO user_video_progress (id, user_id, video_id, watched_duration, is_completed)
          VALUES (${progressId}, ${user_id}, ${video_id}, ${watched_duration || 0}, ${is_completed || false})
        `;
      }

      // Get updated progress
      const result = await sql`
        SELECT uvp.*, v.title, v.youtube_id, v.thumbnail_url, v.duration
        FROM user_video_progress uvp
        JOIN videos v ON uvp.video_id = v.id
        WHERE uvp.user_id = ${user_id} AND uvp.video_id = ${video_id}
      `;

      res.status(200).json({
        success: true,
        progress: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update video progress',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
