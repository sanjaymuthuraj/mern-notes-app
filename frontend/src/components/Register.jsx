import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await register(username, email, password);
    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-500" />
      
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserPlus size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-500 text-sm mt-1">Join to start syncing your notes</p>
      </div>



      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            id="username"
            name="username"
            autoComplete="username"
            required 
            placeholder="johndoe"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
            autoComplete="new-password"
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
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
