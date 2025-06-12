import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, LockClosedIcon, XMarkIcon } from './IconComponents';
import Spinner from './Spinner';

interface DoctorLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DoctorLoginModal: React.FC<DoctorLoginModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginDoctor } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username || !password) {
      setError('Username and password are required.');
      setIsLoading(false);
      return;
    }

    const success = await loginDoctor(username, password);
    setIsLoading(false);

    if (success) {
      onSuccess();
      // onClose(); // onClose is called by onSuccess in App.tsx typically
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-sm transform transition-all"> {/* Softer shadow */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Doctor Login</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="doctorUsername" className="block text-sm font-medium text-slate-700 mb-1">
              <UserCircleIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Username
            </label>
            <input
              type="text"
              id="doctorUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Doctor username"
              required
            />
          </div>
          <div>
            <label htmlFor="doctorPassword"className="block text-sm font-medium text-slate-700 mb-1">
              <LockClosedIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Password
            </label>
            <input
              type="password"
              id="doctorPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 mt-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg font-semibold shadow-md disabled:bg-cyan-300 disabled:from-cyan-300 disabled:to-cyan-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Spinner /> : 'Login as Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLoginModal;