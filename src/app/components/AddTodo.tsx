'use client';
import { useState } from 'react';
import { useTodoStore } from '../store/todo-store';

export default function AddTodo() {
  const { selectedCateg } = useTodoStore();

  const [input, setInput] = useState('');

  const { categories, addTodo } = useTodoStore();

  const handleSubmit = () => {
    if (!input.trim() || !selectedCateg) return;
    addTodo(input, selectedCateg);
    setInput('');
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
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='border p-2 rounded w-full'
        placeholder='Add a new task...'
      />
      <button
        onClick={handleSubmit}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        ➕
      </button>
    </div>
  );
}
