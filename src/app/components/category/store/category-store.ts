import { create } from 'zustand';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoCategory {
  id: string;
  name: string;
  todos?: Todo[];
}

interface CategoryStore {
  categories: TodoCategory[];
  selectedCateg: string;
  setSelectedCateg: (id: string) => void;
  fetchCategories: () => Promise<void>;
  addCategories: (categories: TodoCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategoryTodos: (categoryId: string, newTodos: Todo[]) => Promise<void>;
  reorderCategories: (categoryId1: string, categoryId2: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  selectedCateg: '',

  setSelectedCateg: (id: string) => {
    set({ selectedCateg: id });
  },

  fetchCategories: async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    set({ categories: data });
  },

  addCategories: async (category: TodoCategory) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
      headers: { 'Content-Type': 'application/json' },
    });

    const newCategory = await res.json();

    set((state) => ({ categories: [...state.categories, newCategory] }));
  },

  deleteCategory: async (id) => {
    await fetch('/api/categories', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },

  reorderCategoryTodos: async (categoryId, newTodos) => {
    await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify({ todos: newTodos }),
      headers: { 'Content-Type': 'application/json' },
    });

    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId ? { ...category, todos: newTodos } : category
      ),
    }));
  },

  reorderCategories: async (categoryId1, categoryId2) => {
    await fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId1, categoryId2 }),
    });
    await useCategoryStore.getState().fetchCategories();
  },
}));
