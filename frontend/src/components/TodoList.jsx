import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { title });
      setTitle('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo', err);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/todos/${todo._id}`, { 
        title: todo.title, 
        completed: !todo.completed 
      });
      fetchTodos();
    } catch (err) {
      console.error('Error toggling todo', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"/></div>;
  }

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Todo List</h1>
          <p className="text-slate-500 mt-1">
            {todos.length === 0 ? 'Create your first task' : `${completedCount} of ${todos.length} tasks completed`}
          </p>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text"
          placeholder="What needs to be done?"
          className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 placeholder:text-slate-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!title.trim()}
          className="absolute right-2 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl font-medium text-slate-700 mb-1">No tasks yet</h3>
            <p className="text-slate-500">Add a task above to get started.</p>
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo._id} 
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                todo.completed 
                  ? 'bg-slate-50/80 border-slate-200/50' 
                  : 'bg-white/80 border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div 
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => handleToggle(todo)}
              >
                <button className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-green-500' : 'text-slate-300 hover:text-primary-500'}`}>
                  {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <span className={`text-lg transition-all ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {todo.title}
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(todo._id)}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
