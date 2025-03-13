import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc', // Ensures categories are ordered by the 'order' field in ascending order
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Create a new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const newCategory = await prisma.category.create({ data: { name } });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { categoryId1, categoryId2, id, name } = await req.json();

  if (categoryId1 && categoryId2) {
    const category1 = await prisma.category.findUnique({ where: { id: categoryId1 } });
    const category2 = await prisma.category.findUnique({ where: { id: categoryId2 } });

    if (!category1 || !category2) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Swap the order values
    const updatedCategory1 = await prisma.category.update({
      where: { id: categoryId1 },
      data: { order: category2.order },
    });

    const updatedCategory2 = await prisma.category.update({
      where: { id: categoryId2 },
      data: { order: category1.order },
    });

    return NextResponse.json({ updatedCategory1, updatedCategory2 });
  }

  // Handle category name update
  if (id && name) {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedCategory);
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}


// Delete category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
