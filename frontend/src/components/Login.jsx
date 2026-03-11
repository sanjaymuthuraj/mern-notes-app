import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    if (res.success) {
      toast.success('Logged in successfully!');
      navigate('/');
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
      
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <LogIn size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to manage your notes</p>
      </div>



      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email"
            autoComplete="email"
            required 
            placeholder="you@example.com"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            autoComplete="current-password"
            required 
            placeholder="••••••••"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign up now
        </Link>
      </div>
    </div>
  );
}
