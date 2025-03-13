"use client"
import React, { useEffect, useState } from 'react';
import { useCategoryStore } from './store/category-store';
import { randomUUID } from 'crypto';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const CategoryHome = () => {
  const { categories, setSelectedCateg, reorderCategories, fetchCategories, addCategories, selectedCateg } =
    useCategoryStore();
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const isCateg = categories.find((x) => x.id === selectedCateg);
    if (!isCateg) return;

    setCategoryName(isCateg.name);
  }, [selectedCateg, categories]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;

    if (selectedCateg) addCategories({ id: selectedCateg, name: categoryName });
    else addCategories({ id: randomUUID(), name: categoryName, todos: [] });
    setCategoryName('');
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const categoryId1 = categories[source.index].id;
    const categoryId2 = categories[destination.index].id;

    console.log('Category ID 1 (Source):', categoryId1, 'Category ID 2 (Destination):', categoryId2);

    if (categoryId1 === categoryId2) {
      console.log('Source and destination categories are the same. No update needed.');
      return;
    }

    const reorderedCategories = Array.from(categories);
    const [movedCategory] = reorderedCategories.splice(source.index, 1);
    reorderedCategories.splice(destination.index, 0, movedCategory);
    reorderCategories(categoryId1, categoryId2);
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
          <PlusIcon className='h-3' />
          Save
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='category-list'>
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='space-y-2 w-full mt-5   gap-3'
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
                      className='cursor-pointer p-4   rounded-lg  border shadow-xs mb-3 transition-all  w-fit max-w-2xl'
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
};

export default CategoryHome;
