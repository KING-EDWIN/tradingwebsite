import { getCourseVideos, addVideoToCourse, updateCourseVideo, deleteCourseVideo, extractYouTubeId } from '../../src/lib/course-database.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { course_id } = req.query;

      if (!course_id) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      const videos = await getCourseVideos(course_id);
      return res.status(200).json({ success: true, videos });
    }

    if (req.method === 'POST') {
      const { 
        course_id, 
        title, 
        description, 
        video_url, 
        duration, 
        order_index, 
        is_preview, 
        thumbnail_url 
      } = req.body;

      if (!course_id || !title || !video_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Extract YouTube ID if it's a YouTube URL
      const youtubeId = extractYouTubeId(video_url);

      const videoData = {
        course_id,
        title,
        description: description || '',
        video_url,
        youtube_id: youtubeId || '',
        duration: duration || 0,
        order_index: order_index || 0,
        is_preview: is_preview || false,
        thumbnail_url: thumbnail_url || ''
      };

      const newVideo = await addVideoToCourse(videoData);
      
      if (!newVideo) {
        return res.status(500).json({ error: 'Failed to add video to course' });
      }

      return res.status(201).json({ 
        success: true, 
        video: newVideo 
      });
    }

    if (req.method === 'PUT') {
      const { id, ...videoData } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      // Extract YouTube ID if video_url is being updated
      if (videoData.video_url) {
        videoData.youtube_id = extractYouTubeId(videoData.video_url) || '';
      }

      const updatedVideo = await updateCourseVideo(id, videoData);
      
      if (!updatedVideo) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json({ success: true, video: updatedVideo });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const success = await deleteCourseVideo(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json({ success: true, message: 'Video deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in course videos API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

