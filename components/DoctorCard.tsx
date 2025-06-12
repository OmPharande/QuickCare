import React from 'react';
import { Doctor } from '../types';
import { BriefcaseIcon, StarIcon, ClockIcon, MapPinIcon, UserCircleIcon } from './IconComponents';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
  isSlotBooked: (slot: string) => boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment, isSlotBooked }) => {
  const availableSlotsToShow = doctor.availableSlots.filter(slot => !isSlotBooked(slot)).slice(0, 3);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col"> {/* Softer shadows */}
      <div className="p-6 flex flex-col flex-grow">
        
        <h3 className="text-2xl font-semibold text-slate-800 mb-1">{doctor.name}</h3>
        <p className="text-sky-600 font-medium mb-3">{doctor.specialization}</p> {/* Updated color */}
        
        <div className="flex items-center text-sm text-slate-500 mb-1">
          <StarIcon className="w-4 h-4 text-amber-500 mr-1" /> {/* Amber for stars is fine */}
          {doctor.rating.toFixed(1)} ({Math.floor(Math.random() * 200) + 50} reviews)
        </div>
        <div className="flex items-center text-sm text-slate-500 mb-1">
          <BriefcaseIcon className="w-4 h-4 text-slate-500 mr-1" />
          {doctor.experience} years experience
        </div>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <MapPinIcon className="w-4 h-4 text-slate-500 mr-1" />
          {doctor.location}, {doctor.city} {/* Display city here */}
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{doctor.bio}</p>

        <div className="mt-auto">
          {availableSlotsToShow.length > 0 ? (
            <>
              <p className="text-sm font-medium text-slate-700 mb-2">Next available slots:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableSlotsToShow.map(slot => (
                  <span key={slot} className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full"> {/* Updated colors */}
                    <ClockIcon className="w-3 h-3 inline-block mr-1" />
                    {slot}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded-md mb-4">No available slots for today/tomorrow via quick view. Click below to see all options.</p>
          )}
          <button
            onClick={() => onBookAppointment(doctor)}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;