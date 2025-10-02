import { NextRequest, NextResponse } from 'next/server';
import { getCourseVideos, addVideoToCourse, updateCourseVideo, deleteCourseVideo, extractYouTubeId } from '../../../lib/course-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const videos = await getCourseVideos(courseId);
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('Error fetching course videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      course_id, 
      title, 
      description, 
      video_url, 
      duration, 
      order_index, 
      is_preview, 
      thumbnail_url 
    } = body;

    if (!course_id || !title || !video_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Failed to add video to course' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      video: newVideo 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding video to course:', error);
    return NextResponse.json(
      { error: 'Failed to add video to course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...videoData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Extract YouTube ID if video_url is being updated
    if (videoData.video_url) {
      videoData.youtube_id = extractYouTubeId(videoData.video_url) || '';
    }

    const updatedVideo = await updateCourseVideo(id, videoData);
    
    if (!updatedVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, video: updatedVideo });
  } catch (error) {
    console.error('Error updating course video:', error);
    return NextResponse.json(
      { error: 'Failed to update course video' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteCourseVideo(videoId);
    
    if (!success) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting course video:', error);
    return NextResponse.json(
      { error: 'Failed to delete course video' },
      { status: 500 }
    );
  }
}
