import { NextRequest, NextResponse } from 'next/server';

// Mock video data storage (in production, use a database)
let videos = [
  {
    id: '1',
    title: 'Introduction to Trading',
    description: 'Learn the basics of trading and market analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '10:30',
    category: 'Basics',
    difficulty: 'Beginner',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Advanced Chart Patterns',
    description: 'Master advanced chart patterns for better trading decisions',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '15:45',
    category: 'Technical Analysis',
    difficulty: 'Advanced',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/videos/[id] - Get specific video
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = videos.find(v => v.id === params.id);
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

// PUT /api/videos/[id] - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, category, difficulty, isPublished } = body;

    const videoIndex = videos.findIndex(v => v.id === params.id);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update video
    const updatedVideo = {
      ...videos[videoIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(youtubeUrl && { 
        youtubeUrl,
        thumbnail: youtubeUrl ? `https://img.youtube.com/vi/${extractYouTubeId(youtubeUrl)}/maxresdefault.jpg` : videos[videoIndex].thumbnail
      }),
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(isPublished !== undefined && { isPublished }),
      updatedAt: new Date().toISOString()
    };

    videos[videoIndex] = updatedVideo;

    return NextResponse.json({
      success: true,
      video: updatedVideo
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE /api/videos/[id] - Delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoIndex = videos.findIndex(v => v.id === params.id);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    videos.splice(videoIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


