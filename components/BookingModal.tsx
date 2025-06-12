import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { UserCircleIcon, CalendarIcon, PencilIcon, XMarkIcon, ClockIcon } from './IconComponents'; 
import Spinner from './Spinner';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onConfirmBooking: (patientName: string, appointmentTime: string, notes?: string) => void;
  isSlotBooked: (slot: string) => boolean;
  initialPatientName?: string; 
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onConfirmBooking, isSlotBooked, initialPatientName = '' }) => {
  const [patientName, setPatientName] = useState(initialPatientName);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPatientName) {
        setPatientName(initialPatientName);
    }
  }, [initialPatientName]);


  const availableSlotsForBooking = doctor.availableSlots.filter(slot => !isSlotBooked(slot));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError("Patient name is required.");
      return;
    }
    if (!selectedSlot) {
      setError("Please select an appointment slot.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      onConfirmBooking(patientName, selectedSlot, notes);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100"> {/* Softer shadow */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Book Appointment</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-100 rounded-full"> {/* Updated icon wrapper color */}
                <UserCircleIcon className="w-12 h-12 text-sky-600" /> {/* Updated icon color */}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sky-700">{doctor.name}</h3> {/* Updated text color */}
              <p className="text-slate-600">{doctor.specialization}</p>
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">
              <UserCircleIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Your Name
            </label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Available Slots
            </label>
            {availableSlotsForBooking.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {availableSlotsForBooking.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 w-full border rounded-lg text-sm transition-all duration-200 ${
                      selectedSlot === slot 
                        ? 'bg-sky-600 text-white shadow-lg ring-2 ring-sky-400'  // Updated selected style
                        : 'bg-slate-50 hover:bg-sky-100 text-slate-700 border-slate-300 hover:border-sky-400' // Updated hover style
                    }`}
                  >
                    <ClockIcon className="w-4 h-4 inline-block mr-1"/>
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
                 <p className="text-center text-slate-500 bg-slate-100 p-4 rounded-md">No available slots for this doctor at the moment.</p>
            )}
          </div>
          
          {selectedSlot && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md mb-4">
              Selected: <span className="font-semibold">{selectedSlot}</span>
            </p>
          )}

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
              <PencilIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              placeholder="Any specific information for the doctor?"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedSlot || !patientName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg font-semibold shadow-md disabled:bg-sky-300 disabled:from-sky-300 disabled:to-sky-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;