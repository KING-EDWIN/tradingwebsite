import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, createCourse, getCourseById } from '../../../lib/course-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const isPaid = searchParams.get('is_paid');
    const courseId = searchParams.get('id');

    if (courseId) {
      const course = await getCourseById(courseId);
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course });
    }

    let courses = await getAllCourses();

    // Apply filters
    if (category) {
      courses = courses.filter(course => course.category === category);
    }
    if (difficulty) {
      courses = courses.filter(course => course.difficulty === difficulty);
    }
    if (isPaid !== null) {
      const isPaidBool = isPaid === 'true';
      courses = courses.filter(course => course.is_paid === isPaidBool);
    }

    return NextResponse.json({ 
      success: true, 
      courses, 
      total: courses.length 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      thumbnail_url, 
      category, 
      difficulty, 
      price, 
      currency, 
      is_paid, 
      duration_hours, 
      instructor_name, 
      instructor_avatar, 
      status,
      created_by 
    } = body;

    if (!title || !description || !category || !instructor_name || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const courseData = {
      title,
      description,
      thumbnail_url: thumbnail_url || '',
      category,
      difficulty: difficulty || 'beginner',
      price: price || 0,
      currency: currency || 'USD',
      is_paid: is_paid || false,
      duration_hours: duration_hours || 0,
      instructor_name,
      instructor_avatar: instructor_avatar || '',
      status: status || 'active',
      created_by
    };

    const newCourse = await createCourse(courseData);
    
    if (!newCourse) {
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      course: newCourse 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

