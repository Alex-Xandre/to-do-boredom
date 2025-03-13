'use client';
import React, { useEffect } from 'react';
import { useTodoStore } from './store/tasks-store';
import { useCategoryStore } from '../category/store/category-store';
import TodoItem from './card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './task.css';

import AddTodo from './new';

const TaskList = () => {
  const { todos, fetchTodos, reorderTodos, deleteTodo } = useTodoStore();
  const { selectedCateg } = useCategoryStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
              className=' items-center w-[95vw]  justify-center flex    absolute bottom-12 flex-wrap '
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
                <p className='text-gray-500 m-2'>No todos yet.</p>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        {/* 🗑️ Trash Drop Zone */}
        <Droppable droppableId='trash'>
          {(provided) => (
            // <Button
            //   variant='destructive'
            //   className='absolute right-5 bottom-5'
            //   ref={provided.innerRef}
            //   {...provided.droppableProps}
            // >
            //   <TrashIcon /> Drag here to delete
            //   {provided.placeholder}
            // </Button>

            <div className='absolute bottom-5 right-5'>
              <span
                className='trash '
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span></span>
                <i></i>
              </span>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
