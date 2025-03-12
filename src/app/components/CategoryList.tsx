'use client';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTodoStore } from '../store/todo-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function CategoryList() {
  const { categories, setSelectedCateg, fetchCategories, deleteCategory, addCategories } = useTodoStore();
  const [categoryName, setCategoryName] = useState('');
  const { selectedCateg } = useTodoStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const router = useRouter();

  useEffect(() => {
    if (!categories || categories.length === 0) return; // Check if categories are available

    const isCateg = categories.find((x) => x.id === selectedCateg);
    if (!isCateg) return; // If no category matches the selectedCateg

    setCategoryName(isCateg.name); // Update category name
  }, [selectedCateg, categories]); // Added categories as a dependency

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;

    if (selectedCateg) {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedCateg, name: categoryName }),
      });
    } else addCategories(categoryName);
    setCategoryName('');
    fetchCategories();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    console.log('Source Index:', source.index, 'Destination Index:', destination.index);

    // Get the category IDs at the source and destination indexes
    const categoryId1 = categories[source.index].id;
    const categoryId2 = categories[destination.index].id;

    console.log('Category ID 1 (Source):', categoryId1, 'Category ID 2 (Destination):', categoryId2);

    // If the source and destination categories are the same, no need to reorder
    if (categoryId1 === categoryId2) {
      console.log('Source and destination categories are the same. No update needed.');
      return;
    }

    const reorderedCategories = Array.from(categories);
    const [movedCategory] = reorderedCategories.splice(source.index, 1);
    reorderedCategories.splice(destination.index, 0, movedCategory);

    // Send category swap request to the backend
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId1, categoryId2 }),
    });

    const data = await response.json();
    fetchCategories();
    // Optional: Refresh categories or handle the response as needed
  };

  return (
    <div className='p-3 border m-3 rounded-2xl '>
      <h2 className='text-lg font-bold mb-2'>Group Note</h2>

      <div className='flex gap-2 mb-2 w-1/3'>
        <Input
          type='text'
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder='New Group...'
        />
        <Button
          onClick={handleAddCategory}
          className='inline-flex items-center !h-fit '
          variant='default'
        >
          Save <PlusIcon className='h-3' />
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='category-list'>
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='space-y-2 w-full mt-5   flex-wrap flex gap-3'
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => setSelectedCateg(category.id)}
                      className='cursor-pointer p-4   rounded-lg  border shadow-sm mb-3 transition-all  w-fit max-w-2xl'
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-semibold text-gray-800'>{category.name}</span>
                        {/* <button
                          onClick={() => deleteCategory(category.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          🗑️
                        </button> */}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
