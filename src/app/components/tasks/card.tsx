'use client';

import { useState, useMemo } from 'react';
import './task.css';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const colors = ['bg-[#034C53]', 'bg-[#007074]', 'bg-[#F38C79]', 'bg-[#FFC1B4]'];

export default function TodoItem({ todo }: { todo: Todo }) {
  const [checked, setChecked] = useState(todo.completed);

  // Assign a random color, but memoize it so it stays consistent
  const bgColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

  return (
    <div
      className={`flex items-center gap-4 rounded-full py-2 w-fit px-4 m-0.5 ${bgColor} text-white 
      rotate-[${Math.random() * 20 - 10}deg] hover-shake`}
    >
      <span className={`${checked ? 'line-through opacity-70' : ''}`}>{todo.title}</span>
    </div>
  );
}

{
  /* <input
        type='checkbox'
        checked={checked}
        onChange={() => setChecked(!checked)}
        className='h-5 w-5 cursor-pointer'
      /> */
}
