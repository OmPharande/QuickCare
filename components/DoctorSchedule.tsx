import React from 'react';
import { Appointment } from '../types';

interface Props {
  appointments: Appointment[];
}

const DoctorSchedule: React.FC<Props> = ({ appointments }) => {
  const upcoming = appointments.sort((a, b) =>
    new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
  );

  const today = upcoming.filter(app => {
    const d = new Date(app.appointmentTime);
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
    const d = new Date(appt.appointmentTime);
    if (d.getMonth() === month && d.getFullYear() === year) {
      counts[d.getDate() - 1] += 1;
    }
  });

  const colorFor = (c: number) => {
    if (c === 0) return 'bg-slate-100';
    if (c === 1) return 'bg-sky-200';
    if (c === 2) return 'bg-sky-400';
    return 'bg-sky-600 text-white';
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
        {upcoming.map(appt => (
          <div key={appt.id} className="border border-slate-200 rounded-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-800">Patient: {appt.patientName}</p>
              <p className="text-sm text-slate-500">Notes: {appt.notes || 'N/A'}</p>
            </div>
            <div className="text-sky-600 font-semibold whitespace-nowrap">{appt.appointmentTime}</div>
          </div>
        ))}
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
