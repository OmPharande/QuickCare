import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { UserCircleIcon, CalendarIcon, PencilIcon, XMarkIcon, ClockIcon } from './IconComponents'; 
import Spinner from './Spinner';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onConfirmBooking: (patientName: string, appointmentTime: string, notes?: string, gender?: string, age?: number) => void;
  isSlotBooked: (slot: string) => boolean;
  initialPatientName?: string; 
}

const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onConfirmBooking, isSlotBooked, initialPatientName = '' }) => {
  const [patientName, setPatientName] = useState(initialPatientName);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPatientName) {
        setPatientName(initialPatientName);
    }
  }, [initialPatientName]);


  const now = new Date();
const todayString = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
const isTodaySlot = (slot: string) => {
  // Accepts slot like "Today, 09:00 AM" or "Tomorrow, 10:00 AM" or "Fri, Jun 14, 02:00 PM"
  if (slot.toLowerCase().startsWith('today')) return true;
  const slotDatePart = slot.split(',')[0].trim().toLowerCase();
  return slotDatePart === todayString.toLowerCase();
};

const isFutureSlot = (slot: string) => {
  if (!isTodaySlot(slot)) return true;
  // Parse time part
  const timePart = slot.split(',').pop()?.trim();
  if (!timePart) return true;
  let [time, modifier] = timePart.split(' '); // e.g. 09:00 AM
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return slotDate > now;
};

const availableSlotsForBooking = doctor.availableSlots.filter(slot => !isSlotBooked(slot) && isFutureSlot(slot));

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
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    if (age === '' || isNaN(Number(age)) || Number(age) <= 0) {
      setError("Please enter a valid age.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      onConfirmBooking(patientName, selectedSlot, notes, gender, Number(age));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 z-50 transition-opacity duration-300 ease-in-out overflow-x-auto">
      <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 md:p-8 w-full max-w-lg md:max-w-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100 overflow-x-auto" style={{ maxWidth: '98vw' }}> {/* Responsive & scrollable */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 whitespace-nowrap">Book Appointment</h2>
          <button onClick={onClose} className="self-end text-slate-500 hover:text-slate-700 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="mb-6 pb-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-sky-100 rounded-full flex-shrink-0"> {/* Updated icon wrapper color */}
                <UserCircleIcon className="w-12 h-12 text-sky-600" /> {/* Updated icon color */}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-semibold text-sky-700 truncate">{doctor.name}</h3> {/* Responsive text */}
              <p className="text-slate-600 truncate">{doctor.specialization}</p>
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="md:flex gap-6">
            {/* Left column */}
            <div className="md:w-1/2 space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">
                  <UserCircleIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Name
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

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age Field */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  min={0}
                  onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                  placeholder="Enter your age"
                  required
                />
              </div>

              {/* Notes Field */}
              <div>
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
            </div>

            {/* Right column: slot selector */}
            <div className="md:w-1/2 mt-6 md:mt-0">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <CalendarIcon className="w-5 h-5 inline-block mr-1 text-slate-500" /> Available Slots
              </label>
              {availableSlotsForBooking.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar border border-slate-200 rounded-lg p-2">
                  {availableSlotsForBooking.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 w-full border rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                        selectedSlot === slot ? 'bg-sky-600 text-white shadow-lg ring-2 ring-sky-400' : 'bg-slate-50 hover:bg-sky-100 text-slate-700 border-slate-300 hover:border-sky-400'
                      }`}
                    >
                      <ClockIcon className="w-4 h-4 inline-block mr-1" />
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 bg-slate-100 p-4 rounded-md">No available slots for this doctor at the moment.</p>
              )}
              <p className="text-xs text-slate-500 mt-2">Today's slots are shown only if they are later than the current time.</p>

              {selectedSlot && (
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md mt-3">
                  Selected: <span className="font-semibold">{selectedSlot}</span>
                </p>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedSlot || !patientName.trim()}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-md disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;