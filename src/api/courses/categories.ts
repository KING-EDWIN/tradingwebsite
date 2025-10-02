import { NextRequest, NextResponse } from 'next/server';
import { getAllCourseCategories } from '../../../lib/course-database';

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCourseCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching course categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course categories' },
      { status: 500 }
    );
  }
}
