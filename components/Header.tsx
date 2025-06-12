import React, { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDaysIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon, CogIcon } from './IconComponents';

interface HeaderProps {
  onShowMyBookings: () => void;
  onShowPatientAuthModal: () => void;
  onShowDoctorAuthModal: () => void;
}

const Header: FC<HeaderProps> = ({ onShowMyBookings, onShowPatientAuthModal, onShowDoctorAuthModal }) => {
  const { currentUser, logout, isLoading } = useAuth();

  const getWelcomeMessage = () => {
    if (!currentUser) return null;
    if (currentUser.type === 'patient') return `Welcome, ${currentUser.name.split(' ')[0]}`;
    if (currentUser.type === 'doctor') return `Dr. ${currentUser.name.split(' ').slice(-1)[0]} (Portal)`;
    return null;
  };
  
  const appointmentsButtonText = currentUser?.type === 'doctor' ? 'My Schedule' : 'My Appointments';


  return (
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg sticky top-0 z-50"> {/* Updated gradient */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 sm:mb-0">
          QuickCare
        </h1>
        <div className="flex items-center space-x-3">
          {!isLoading && currentUser && (
            <span className="text-sm hidden md:block opacity-90">{getWelcomeMessage()}</span>
          )}

          {!isLoading && currentUser && (
             <button
              onClick={onShowMyBookings}
              className="bg-white text-sky-700 hover:bg-sky-50 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center text-sm"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              {appointmentsButtonText}
            </button>
          )}

          {!isLoading && !currentUser && (
            <>
              <button
                onClick={onShowPatientAuthModal}
                className="bg-white text-sky-700 hover:bg-sky-50 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center text-sm"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Patient Login/Sign Up
              </button>
              <button
                onClick={onShowDoctorAuthModal}
                title="Doctor Login"
                className="bg-white/10 text-white hover:bg-white/20 font-semibold p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                aria-label="Doctor Login"
              >
                <CogIcon className="w-5 h-5" />
              </button>
            </>
          )}
          {!isLoading && currentUser && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center text-sm"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;