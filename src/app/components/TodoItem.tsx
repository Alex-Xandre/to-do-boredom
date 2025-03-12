"use client";

import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [checked, setChecked] = useState(todo.completed);

  return (
    <div className="flex items-center gap-4 p-2 bg-gray-100 rounded-md">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="h-5 w-5 cursor-pointer"
      />
      <span className={`${checked ? "line-through text-gray-400" : ""}`}>
        {todo.title}
      </span>
      <button className="ml-auto text-red-500 hover:text-red-700">❌</button>
    </div>
  );
}
