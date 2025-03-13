
import CategoryHome from './components/category';
import TaskList from './components/tasks';

export default function Home() {
  return (
    <main className='mx-auto pt-10 h-screen flex flex-col'>
      <CategoryHome />
     <TaskList/>
    </main>
  );
}
