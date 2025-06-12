import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './IconComponents';


interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  let bgColor, textColor, IconComponent, borderColor;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      borderColor = 'border-green-400';
      textColor = 'text-green-700';
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-400';
      textColor = 'text-red-700';
      IconComponent = XCircleIcon;
      break;
    case 'info':
    default:
      bgColor = 'bg-sky-100'; // Updated to sky blue
      borderColor = 'border-sky-400'; // Updated to sky blue
      textColor = 'text-sky-700'; // Updated to sky blue
      IconComponent = InformationCircleIcon;
      break;
  }

  return (
    <div className={`fixed top-20 right-4 z-[100] p-4 border-l-4 rounded-md shadow-lg ${bgColor} ${textColor} ${borderColor} flex items-center transition-all duration-300 ease-in-out animate-slide-in`} role="alert">
      <IconComponent className="w-6 h-6 mr-3" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${bgColor} ${textColor} hover:bg-opacity-50 focus:ring-current`} aria-label="Close">
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Alert;