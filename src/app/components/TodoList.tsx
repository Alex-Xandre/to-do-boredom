'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';
import { useTodoStore } from '../store/todo-store';
import AddTodo from './AddTodo';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

export default function TodoList() {
  const { todos, fetchTodos, reorderTodos, deleteTodo, selectedCateg } = useTodoStore();
  const [animatedTodos, setAnimatedTodos] = useState(todos);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // ✅ Added dependency to prevent warnings

  useEffect(() => {
    setAnimatedTodos(todos);
  }, [todos]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // 🗑️ If dropped in trash, delete the todo
    if (destination.droppableId === 'trash') {
      deleteTodo(todos[source.index].id);
      return;
    }

    // ✅ Reorder todos correctly
    const reorderedTodos = Array.from(todos);
    const [movedTodo] = reorderedTodos.splice(source.index, 1);
    reorderedTodos.splice(destination.index, 0, movedTodo);

    reorderTodos(reorderedTodos);
  };

  if (!selectedCateg) {
    return null;
  }

  return (
    <div className='border p-3 m-3 rounded-xl w-1/2  '>
      {selectedCateg && <AddTodo />}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='todo-list'>
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='space-y-2'
            >
              {todos?.length > 0 && todos.filter((x) => x.categoryId === selectedCateg).length > 0 ? (
                todos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem todo={todo} />
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <p className='text-gray-500'>No todos yet.</p>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        {/* 🗑️ Trash Drop Zone */}
        <Droppable droppableId='trash'>
          {(provided) => (
            <Button
              variant='destructive'
              className='absolute right-5 bottom-5'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <TrashIcon /> Drag here to delete
              {provided.placeholder}
            </Button>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
