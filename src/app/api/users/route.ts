import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  const { searchParams } = new URL(request.url);

  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '100';
  const sort = searchParams.get('sort') || 'id,desc';

  try {
    const res = await fetch(`${API_BASE_URL}/users?page=${page}&size=${size}&sort=${sort}`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('API proxy /api/users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
