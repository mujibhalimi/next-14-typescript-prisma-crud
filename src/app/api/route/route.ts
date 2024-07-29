// src/app/api/route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';  // Adjust import based on your project structure

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 10;

    if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({ error: 'Invalid pageSize parameter' }, { status: 400 });
    }

    const skip = (page - 1) * pageSize;

    const posts = await prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy:{
        id:'desc'
      }
    });
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / pageSize);
    return NextResponse.json({
      posts,
      currentPage: page,
      totalPages,
      pageSize,
      totalPosts
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    const post = await prisma.post.create({
      data: {
        title,
        content
      }
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error:', error);
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const { id, title, content } = await req.json();
//     const post = await prisma.post.update({
//       where: { id },
//       data: {
//         title,
//         content
//       }
//     });
//     return NextResponse.json(post);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
//   try {
//     const { id } = params;

//     const post = await prisma.post.delete({
//       where: { id: id },
//     });

//     return NextResponse.json(post);
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
//   }
// }