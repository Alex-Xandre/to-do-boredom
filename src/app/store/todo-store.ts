import { create } from 'zustand';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoCategory {
  id: string;
  name: string;
  todos: Todo[];
}

interface TodoStore {
  todos: Todo[];
  categories: TodoCategory[];
  selectedCateg: string;
  setSelectedCateg: (id: string) => void;
  fetchTodos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addCategories: (name: string) => Promise<void>;
  addTodo: (title: string, categ: string) => Promise<void>;
  updateTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderTodos: (newTodos: Todo[]) => Promise<void>;
  reorderCategoryTodos: (categoryId: string, newTodos: Todo[]) => Promise<void>;
  reorderCategories: (newCategories: TodoCategory[]) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  categories: [],

  selectedCateg: '',
  setSelectedCateg: (id: string) => {
    set({ selectedCateg: id });
  },
  // Fetch all todos from the API
  fetchTodos: async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    set({ todos: data });
  },

  // Fetch all categories from the API
  fetchCategories: async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    set({ categories: data });
  },

  // Add a new todo
  addTodo: async (title, categoryId) => {
    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title, categoryId }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  // Add a new todo
  addCategories: async (name) => {
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchCategories();
  },

  // Update the completion status of a todo
  updateTodo: async (id, completed) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ id, completed }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  // Delete a todo
  deleteTodo: async (id) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  // Delete a category and its associated todos
  deleteCategory: async (id) => {
    await fetch('/api/categories', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchCategories();
  },

  // Reorder todos in the store
  reorderTodos: async (newTodos) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ todos: newTodos }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchTodos();
  },

  // Reorder todos within a specific category
  reorderCategoryTodos: async (categoryId, newTodos) => {
    await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify({ todos: newTodos }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchCategories();
  }, 
  
  // Reorder categories in the store
  reorderCategories: async (newCategories) => {

    await fetch('/api/categories', {
      method: 'PUT',
      body: JSON.stringify({ categories: newCategories }),
      headers: { 'Content-Type': 'application/json' },
    });
    await useTodoStore.getState().fetchCategories();
  },
}));
