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
    <div className="bg-white shadow-lg rounded-xl overflow-x-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-row md:flex-col w-full max-w-full md:max-w-xs" style={{ maxWidth: '98vw' }}>
      <div className="p-4 sm:p-6 flex flex-col flex-grow min-w-0">
        <h3 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-1 truncate">{doctor.name}</h3>
        <p className="text-sky-600 text-xs sm:text-sm font-semibold mb-1 truncate">{doctor.specialization}</p>
        <div className="flex flex-wrap items-center text-slate-500 text-xs mb-2 gap-x-2 gap-y-1">
          <StarIcon className="w-4 h-4 mr-1 text-yellow-400" /> {doctor.rating} ({doctor.reviews?.length ?? 0} reviews)
          <BriefcaseIcon className="w-4 h-4 mx-2 text-slate-400" /> {doctor.experience} yrs
        </div>
        <div className="flex items-center text-slate-500 text-xs mb-2">
          <MapPinIcon className="w-4 h-4 mr-1 text-slate-400" /> <span className="truncate">{doctor.location}</span>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-3 flex-grow truncate">{doctor.bio}</p>

        <div className="mt-auto">
          {availableSlotsToShow.length > 0 ? (
            <>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Next available slots:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableSlotsToShow.map(slot => (
                  <span key={slot} className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full whitespace-nowrap">
                    <ClockIcon className="w-3 h-3 inline-block mr-1" />
                    {slot}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-rose-600 bg-rose-50 p-2 rounded-md mb-4">No available slots for today/tomorrow via quick view. Click below to see all options.</p>
          )}
          <button
            onClick={() => onBookAppointment(doctor)}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;