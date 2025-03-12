import AddTodo from './components/AddTodo';
import CategoryList from './components/CategoryList';
import TodoList from './components/TodoList';
import { useTodoStore } from './store/todo-store';

export default function Home() {
  return (
    <main className='mx-auto pt-10 h-screen flex flex-col'>
      <CategoryList />
      <TodoList />
    </main>
  );
}
