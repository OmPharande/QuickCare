import React from 'react';
import { Appointment } from '../types';

// Helper to convert relative time strings (e.g. "Today, 09:00 AM") to a Date object
const parseDateTime = (dateTimeStr: string): Date => {
  const now = new Date();
  // Start with today's date at 00:00
  const datePart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateTimeStr.startsWith('Tomorrow,')) {
    datePart.setDate(datePart.getDate() + 1);
  }
  // For explicit weekday/date handling in future, extend here

  const timeStr = dateTimeStr.split(', ')[1]; // "09:00 AM"
  if (!timeStr) return datePart; // Fallback
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  datePart.setHours(hours, minutes, 0, 0);
  return datePart;
};

interface UpdateProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: 'done' | 'no_show' | 'cancelled') => void;
}

const DoctorSchedule: React.FC<UpdateProps> = ({ appointments, onUpdateStatus }) => {
  const upcoming = appointments.sort((a, b) =>
    parseDateTime(a.appointmentTime).getTime() - parseDateTime(b.appointmentTime).getTime()
  );

  const today = upcoming.filter(app => {
    const d = parseDateTime(app.appointmentTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  // Build counts per day for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const counts = Array.from({ length: daysInMonth }, () => 0);
  upcoming.forEach(appt => {
    const d = parseDateTime(appt.appointmentTime);
    if (d.getMonth() === month && d.getFullYear() === year) {
      counts[d.getDate() - 1] += 1;
    }
  });

  const colorFor = (c: number) => {
    if (c === 0) return 'bg-slate-100';            // No appointments
    if (c === 1) return 'bg-sky-100';              // 1 appointment
    if (c === 2) return 'bg-sky-300';              // 2 appointments
    if (c === 3) return 'bg-sky-500 text-white';   // 3 appointments
    if (c === 4) return 'bg-sky-600 text-white';   // 4 appointments
    return 'bg-sky-700 text-white';                // 5 or more appointments (cap)
  };

  return (
    <div className="w-full mt-6 p-6 bg-white rounded-lg shadow-lg md:flex gap-8">
      <h2 className="text-2xl font-bold mb-4 text-sky-700">My Schedule</h2>
      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-sky-100 p-4 rounded-lg">
          <p className="text-3xl font-semibold text-sky-700">{today.length}</p>
          <p className="text-sm text-sky-700">Appointments Today</p>
        </div>
        <div className="bg-sky-100 p-4 rounded-lg">
          <p className="text-3xl font-semibold text-sky-700">{upcoming.length}</p>
          <p className="text-sm text-sky-700">Total Upcoming</p>
        </div>
      </div>
      <div className="md:w-2/3">
        {upcoming.length === 0 && (
          <p className="text-center text-gray-500">No upcoming appointments.</p>
        )}
        {upcoming.map(appt => {
          const apptDate = parseDateTime(appt.appointmentTime);
          const isPast = apptDate < now;
          return (
            <div key={appt.id} className="border border-slate-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="font-medium text-slate-800">Patient: {appt.patientName}</p>
                <p className="text-sm text-slate-500">Notes: {appt.notes || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sky-600 font-semibold whitespace-nowrap">{appt.appointmentTime}</span>
                {isPast && (!appt.status || appt.status === 'upcoming') && (
                  <div className="flex gap-2">
                    <button onClick={() => onUpdateStatus(appt.id, 'done')} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded">Done</button>
                    <button onClick={() => onUpdateStatus(appt.id, 'no_show')} className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded">No Show</button>
                  </div>
                )}
                {appt.status && appt.status !== 'upcoming' && (
                  <span className={`text-xs px-2 py-1 rounded ${appt.status==='done'?'bg-green-100 text-green-700':appt.status==='no_show'?'bg-rose-100 text-rose-700':'bg-slate-200 text-slate-700'}`}>{appt.status.replace('_',' ')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Heatmap */}
      <div className="md:w-1/3 mt-6 md:mt-0">
        <h3 className="text-lg font-semibold text-slate-700 mb-2 text-center">{now.toLocaleString('default', { month: 'long' })} {year}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S','M','T','W','T','F','S'].map(d=>(<div key={d} className="text-center font-medium text-slate-500">{d}</div>))}
          {Array.from({length: new Date(year, month, 1).getDay()}, (_,i)=>(<div key={'blank'+i}></div>))}
          {counts.map((c, idx) => (
            <div key={idx} className={`h-8 w-8 rounded ${colorFor(c)} flex items-center justify-center`} title={`${idx+1}: ${c} appointments`}>{idx+1}</div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">Shading indicates number of appointments per day.</p>
      </div>
    </div>
  );
};

export default DoctorSchedule;
