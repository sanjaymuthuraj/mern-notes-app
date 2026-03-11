import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const COLORS = [
  '#ffffff', // default white
  '#fef08a', // yellow
  '#bfdbfe', // blue
  '#bbf7d0', // green
  '#fbcfe8', // pink
  '#fed7aa', // orange
];

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor(COLORS[0]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/notes/${editingId}`, { title, content, color });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/notes`, { title, content, color });
      }
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error('Error saving note', err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || COLORS[0]);
    setEditingId(note._id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/notes/${id}`);
      // Wait for CSS transition to visually fade out before removing from state
      setTimeout(() => {
        setNotes(prevNotes => prevNotes.filter(n => n._id !== id));
        setDeletingId(null);
      }, 300);
    } catch (err) {
      console.error('Error deleting note', err);
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"/></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Notes</h1>
          <p className="text-slate-500 mt-1">Create, view, and organize your thoughts</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200"
          >
            <Plus size={20} />
            <span className="font-medium">New Note</span>
          </button>
        )}
      </div>

      {/* Note Editor */}
      {isAdding && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 overflow-hidden relative transition-all">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
          <form onSubmit={handleSubmit} className="space-y-4 ml-2">
            <input 
              type="text"
              placeholder="Note Title"
              className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 text-slate-900"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
            <textarea
              placeholder="Start typing your note here..."
              className="w-full h-32 text-base bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-400 text-slate-700 resize-none"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 mr-2">Color:</span>
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${c === '#ffffff' ? 'border-slate-200 bg-white' : 'border-black/5'} hover:scale-110 ${color === c ? 'ring-2 ring-primary-500 scale-110' : ''}`}
                    style={{ backgroundColor: c !== '#ffffff' ? c : undefined }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button 
                  type="submit" 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-md"
                >
                  <Check size={18} />
                  <span>{editingId ? 'Update Note' : 'Save Note'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-medium text-slate-700 mb-1">No notes yet</h3>
          <p className="text-slate-500">Create your first note to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div 
              key={note._id} 
              className={`group relative flex flex-col p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 ${deletingId === note._id ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              style={{ backgroundColor: note.color || '#ffffff' }}
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2 pr-12 line-clamp-1">{note.title}</h3>
                <p className="text-slate-600 whitespace-pre-wrap line-clamp-4 leading-relaxed">{note.content}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
                
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-white/50 backdrop-blur-sm rounded-lg p-1">
                  <button 
                    onClick={() => handleEdit(note)}
                    className="p-2 text-slate-600 hover:text-primary-600 hover:bg-white rounded-md transition-colors"
                    title="Edit Note"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(note._id)}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-white rounded-md transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
