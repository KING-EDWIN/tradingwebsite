import { NextRequest, NextResponse } from 'next/server';
import { getAllVideos, createVideo } from '../../lib/database';

// GET /api/videos - Get all videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let videos = await getAllVideos();

    // Apply filters
    if (category) {
      videos = videos.filter(video => video.category === category);
    }
    if (status) {
      videos = videos.filter(video => video.status === status);
    }

    return NextResponse.json({
      success: true,
      videos: videos,
      total: videos.length
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, category, duration, thumbnail_url } = body;

    // Validate required fields
    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    // Create new video
    const newVideo = await createVideo({
      title,
      description,
      url,
      category,
      duration,
      thumbnail_url
    });

    if (!newVideo) {
      return NextResponse.json(
        { success: false, error: 'Failed to create video' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      video: newVideo
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create video' },
      { status: 500 }
    );
  }
}



