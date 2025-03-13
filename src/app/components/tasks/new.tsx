'use client';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useCategoryStore } from '../category/store/category-store';
import { useTodoStore } from './store/tasks-store';

export default function AddTodo() {
  const { selectedCateg } = useCategoryStore();
  const { addTodo } = useTodoStore();

  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || !selectedCateg) return;
    addTodo(input, selectedCateg);
    // setInput('');
  };

  return (
    <div className='flex gap-2'>
      {/* <select onChange={(e) => setCategoryId(e.target.value)} className="border p-2 rounded">
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select> */}
      <Input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='border p-2 rounded w-full'
        placeholder='Add a new task...'
      />
      <Button
        onClick={handleSubmit}
        className='inline-flex items-center !h-fit '
        variant='default'
      >
        <PlusIcon className='h-3' />
        Save
      </Button>
    </div>
  );
}
