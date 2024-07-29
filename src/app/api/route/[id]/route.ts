import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = params;
    const postId = Number(id);
    const post = await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = params;
    const postId = Number(id);
    const { title, content } = await req.json();
    const post = await prisma.post.update({
      where: { id:postId },
      data: {
        title,
        content
      }
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}