const { sql } = require('@vercel/postgres');
const { v4: uuidv4 } = require('uuid');

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { category, difficulty, status, user_id } = req.query;
      
      let query = `
        SELECT v.*, 
               vc.name as category_name,
               au.email as uploaded_by_email,
               uvp.watched_duration,
               uvp.is_completed,
               uvp.last_watched
        FROM videos v
        LEFT JOIN video_categories vc ON v.category = vc.name
        LEFT JOIN admin_users au ON v.uploaded_by = au.id
        LEFT JOIN user_video_progress uvp ON v.id = uvp.video_id AND uvp.user_id = ${user_id || 'NULL'}
        WHERE v.status != 'deleted'
      `;
      
      const conditions = [];
      const values = [];
      let paramCount = 1;

      if (category) {
        conditions.push(`v.category = $${paramCount}`);
        values.push(category);
        paramCount++;
      }
      
      if (difficulty) {
        conditions.push(`v.difficulty = $${paramCount}`);
        values.push(difficulty);
        paramCount++;
      }
      
      if (status) {
        conditions.push(`v.status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }

      if (conditions.length > 0) {
        query += ` AND ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY v.created_at DESC`;

      const result = await sql.unsafe(query, values);

      res.status(200).json({
        success: true,
        videos: result.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          youtube_url: row.youtube_url,
          youtube_id: row.youtube_id,
          thumbnail_url: row.thumbnail_url,
          duration: row.duration,
          category: row.category,
          category_name: row.category_name,
          difficulty: row.difficulty,
          status: row.status,
          is_private: row.is_private,
          uploaded_by: row.uploaded_by_email,
          created_at: row.created_at,
          updated_at: row.updated_at,
          progress: {
            watched_duration: row.watched_duration || 0,
            is_completed: row.is_completed || false,
            last_watched: row.last_watched
          }
        }))
      });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch videos',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, youtube_url, category, difficulty, is_private, uploaded_by } = req.body;

      // Validate required fields
      if (!title || !youtube_url) {
        return res.status(400).json({
          success: false,
          error: 'Title and YouTube URL are required'
        });
      }

      // Extract YouTube video ID
      const youtubeId = extractYouTubeId(youtube_url);
      if (!youtubeId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid YouTube URL'
        });
      }

      // Generate thumbnail URL
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

      // Create video
      const videoId = uuidv4();
      await sql`
        INSERT INTO videos (id, title, description, youtube_url, youtube_id, thumbnail_url, category, difficulty, is_private, uploaded_by)
        VALUES (${videoId}, ${title}, ${description || null}, ${youtube_url}, ${youtubeId}, ${thumbnailUrl}, ${category || null}, ${difficulty || 'beginner'}, ${is_private || false}, ${uploaded_by || null})
      `;

      // Get created video
      const result = await sql`
        SELECT v.*, vc.name as category_name, au.email as uploaded_by_email
        FROM videos v
        LEFT JOIN video_categories vc ON v.category = vc.name
        LEFT JOIN admin_users au ON v.uploaded_by = au.id
        WHERE v.id = ${videoId}
      `;

      res.status(201).json({
        success: true,
        video: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create video',
        details: error.message
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { title, description, youtube_url, category, difficulty, status, is_private } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Video ID is required'
        });
      }

      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updateFields.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }
      if (youtube_url !== undefined) {
        const youtubeId = extractYouTubeId(youtube_url);
        if (!youtubeId) {
          return res.status(400).json({
            success: false,
            error: 'Invalid YouTube URL'
          });
        }
        updateFields.push(`youtube_url = $${paramCount}`);
        values.push(youtube_url);
        paramCount++;
        updateFields.push(`youtube_id = $${paramCount}`);
        values.push(youtubeId);
        paramCount++;
        updateFields.push(`thumbnail_url = $${paramCount}`);
        values.push(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
        paramCount++;
      }
      if (category !== undefined) {
        updateFields.push(`category = $${paramCount}`);
        values.push(category);
        paramCount++;
      }
      if (difficulty !== undefined) {
        updateFields.push(`difficulty = $${paramCount}`);
        values.push(difficulty);
        paramCount++;
      }
      if (status !== undefined) {
        updateFields.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }
      if (is_private !== undefined) {
        updateFields.push(`is_private = $${paramCount}`);
        values.push(is_private);
        paramCount++;
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      await sql.unsafe(`
        UPDATE videos 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
      `, values);

      // Get updated video
      const result = await sql`
        SELECT v.*, vc.name as category_name, au.email as uploaded_by_email
        FROM videos v
        LEFT JOIN video_categories vc ON v.category = vc.name
        LEFT JOIN admin_users au ON v.uploaded_by = au.id
        WHERE v.id = ${id}
      `;

      res.status(200).json({
        success: true,
        video: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update video',
        details: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Video ID is required'
        });
      }

      await sql`
        UPDATE videos 
        SET status = 'deleted', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ${id}
      `;

      res.status(200).json({
        success: true,
        message: 'Video deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete video',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
