import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';

  try {
    const res = await fetch(`${API_BASE_URL}/users/assignees`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('API proxy /api/users/assignees error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignees' }, { status: 500 });
  }
}
