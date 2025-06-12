import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon, XMarkIcon, UserPlusIcon } from './IconComponents';
import Spinner from './Spinner';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void; 
}

type AuthMode = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginPatient, signupPatient } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    let success = false;

    if (mode === 'login') {
      if (!email || !password) {
        setError('Email and password are required.');
        setIsLoading(false);
        return;
      }
      success = await loginPatient(email, password);
      if (!success) setError('Invalid email or password.');
    } else { 
      if (!name || !email || !password) {
        setError('Name, email, and password are required.');
        setIsLoading(false);
        return;
      }
      success = await signupPatient(name, email, password);
      if (!success) setError('Email already exists or signup failed.');
    }

    setIsLoading(false);
    if (success) {
      onSuccess();
      // onClose(); // onClose is called by onSuccess in App.tsx typically
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all"> {/* Softer shadow */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            {mode === 'login' ? 'Patient Login' : 'Patient Sign Up'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                <UserCircleIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Your full name"
                required={mode === 'signup'}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              <EnvelopeIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
              <LockClosedIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Your password"
              required
            />
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg font-semibold shadow-md disabled:bg-sky-300 disabled:from-sky-300 disabled:to-sky-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : (mode === 'login' ? 'Login' : 'Sign Up')}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="w-full text-sm text-sky-600 hover:text-sky-800 font-medium py-2 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AuthModal;