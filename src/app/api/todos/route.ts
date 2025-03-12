import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.todo.findMany({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, categoryId } = await req.json();
  const lastTodo = await prisma.todo.findFirst({
    where: { categoryId },
    orderBy: { order: 'desc' },
  });

  const newOrder = lastTodo ? lastTodo.order + 1 : 0;

  const newTodo = await prisma.todo.create({
    data: { title, categoryId, order: newOrder },
  });
  return NextResponse.json(newTodo);
}

export async function PUT(req: Request) {
  const { id, completed, todos, categoryId } = await req.json();

  if (todos) {
    const updatedTodos = await Promise.all(
      todos.map((todo: { id: string }, index: number) =>
        prisma.todo.update({
          where: { id: todo.id },
          data: { order: index },
        })
      )
    );
    return NextResponse.json(updatedTodos);
  }

  if (id && categoryId) {
    const lastTodo = await prisma.todo.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastTodo ? lastTodo.order + 1 : 0;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { categoryId, order: newOrder },
    });
    return NextResponse.json(updatedTodo);
  }

  if (id !== undefined && completed !== undefined) {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    return NextResponse.json(updatedTodo);
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
