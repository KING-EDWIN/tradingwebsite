import { NextRequest, NextResponse } from 'next/server';
import { useToken } from '@/lib/database';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name, token } = await request.json();

    if (!email || !name || !token) {
      return NextResponse.json(
        { error: 'Email, name, and token are required' },
        { status: 400 }
      );
    }

    const user = await useToken(token, { email, name });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const authToken = generateToken({
      id: user.id,
      email: user.email,
      type: 'user'
    });

    return NextResponse.json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        token: user.token,
        status: user.status
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



