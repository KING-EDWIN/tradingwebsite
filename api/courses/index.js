import { getAllCourses, createCourse, getCourseById } from '../../src/lib/course-database.js';

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
      const { category, difficulty, is_paid, id } = req.query;

      if (id) {
        const course = await getCourseById(id);
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json({ success: true, course });
      }

      let courses = await getAllCourses();

      // Apply filters
      if (category) {
        courses = courses.filter(course => course.category === category);
      }
      if (difficulty) {
        courses = courses.filter(course => course.difficulty === difficulty);
      }
      if (is_paid !== undefined) {
        const isPaidBool = is_paid === 'true';
        courses = courses.filter(course => course.is_paid === isPaidBool);
      }

      return res.status(200).json({ 
        success: true, 
        courses, 
        total: courses.length 
      });
    }

    if (req.method === 'POST') {
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
      } = req.body;

      if (!title || !description || !category || !instructor_name || !created_by) {
        return res.status(400).json({ error: 'Missing required fields' });
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
        return res.status(500).json({ error: 'Failed to create course' });
      }

      return res.status(201).json({ 
        success: true, 
        course: newCourse 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in courses API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

