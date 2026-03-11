import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotebookIcon, LogOut, ListTodo, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <NotebookIcon size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 hidden xs:block sm:block">
              MERN Notes
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-sm text-slate-600">
                    Hello, <span className="font-semibold text-slate-900">{user.username}</span>
                  </div>
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Notes"
                  >
                    <FileText size={20} className="sm:w-[16px] sm:h-[16px]" />
                    <span className="hidden sm:inline">Notes</span>
                  </Link>
                  <Link 
                    to="/todos" 
                    className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Todos"
                  >
                    <ListTodo size={20} className="sm:w-[16px] sm:h-[16px]" />
                    <span className="hidden sm:inline">Todos</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} className="sm:w-[16px] sm:h-[16px]" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm shadow-primary-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div> 
      </div>
    </nav>
  );
}
