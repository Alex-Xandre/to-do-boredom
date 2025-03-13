import { create } from 'zustand';

interface Todo {
  categoryId: string;
  id: string;
  title: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, categoryId: string) => Promise<void>;
  updateTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (newTodos: Todo[]) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  fetchTodos: async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    set({ todos: data });
  },

  addTodo: async (title, categoryId) => {
    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title, categoryId }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  updateTodo: async (id, completed) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ id, completed }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  deleteTodo: async (id) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  reorderTodos: async (newTodos) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ todos: newTodos }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },
}));
