import React from 'react';
import { Appointment, Doctor, CurrentUser } from '../types';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon, InformationCircleIcon, XMarkIcon, TrashIcon, BriefcaseIcon } from './IconComponents';

interface MyAppointmentsModalProps {
  appointments: Appointment[];
  onClose: () => void;
  onCancelAppointment: (appointmentId: string) => void;
  doctors: Doctor[];
  currentUser: CurrentUser; 
}

const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({ appointments, onClose, onCancelAppointment, doctors, currentUser }) => {
  
  const getDoctorDetails = (doctorId: string): Doctor | undefined => {
    return doctors.find(doc => doc.id === doctorId);
  };

  const filteredAppointments = currentUser
    ? currentUser.type === 'patient'
      ? appointments.filter(app => app.patientId === currentUser.id)
      : currentUser.type === 'doctor'
      ? appointments.filter(app => app.doctorId === currentUser.id)
      : []
    : [];
  
  const modalTitle = currentUser?.type === 'doctor' ? "My Schedule" : "My Appointments";
  const noAppointmentsMessage = currentUser?.type === 'doctor' 
    ? "You have no upcoming appointments in your schedule."
    : "You have no upcoming appointments.";

  const sortedAppointments = [...filteredAppointments].sort((a,b) => {
      const parseDateTime = (dateTimeStr: string): Date => {
          const now = new Date();
          let datePart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 

          if (dateTimeStr.startsWith('Tomorrow,')) {
              datePart.setDate(datePart.getDate() + 1);
          }
          
          const timeStr = dateTimeStr.split(', ')[1]; 
          const [time, modifier] = timeStr.split(' '); 
          let [hours, minutes] = time.split(':').map(Number); 

          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0; 

          datePart.setHours(hours, minutes, 0, 0);
          return datePart;
      };
      return parseDateTime(a.appointmentTime).getTime() - parseDateTime(b.appointmentTime).getTime();
  });


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-100 opacity-100"> {/* Softer shadow */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center">
            {currentUser?.type === 'doctor' ? 
              <BriefcaseIcon className="w-8 h-8 mr-3 text-cyan-600" /> :  /* Updated color for doctor */
              <CalendarDaysIcon className="w-8 h-8 mr-3 text-sky-600" /> /* Updated color for patient */
            }
            {modalTitle}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="text-center py-10">
            <InformationCircleIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-xl text-slate-600">{noAppointmentsMessage}</p>
            {currentUser?.type === 'patient' && <p className="text-slate-500">Book one today to see it here!</p>}
          </div>
        ) : (
          <ul className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {sortedAppointments.map(app => {
              const doctorDetails = getDoctorDetails(app.doctorId);
              return (
                <li key={app.id} className="bg-slate-50 p-5 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    {doctorDetails && (
                         <div className={`p-3 rounded-full self-center sm:self-start ${currentUser?.type === 'doctor' ? 'bg-cyan-100' : 'bg-sky-100'}`}>
                            <UserCircleIcon className={`w-12 h-12 ${currentUser?.type === 'doctor' ? 'text-cyan-600' : 'text-sky-600'}`} />
                        </div>
                    )}
                    <div className="flex-grow">
                      {currentUser?.type === 'patient' && doctorDetails && (
                        <h3 className="text-xl font-semibold text-sky-700">With Dr. {app.doctorName}</h3> 
                      )}
                       {currentUser?.type === 'doctor' && (
                        <h3 className="text-xl font-semibold text-cyan-700">Patient: {app.patientName}</h3> 
                      )}
                      {currentUser?.type === 'doctor' && doctorDetails && (
                         <p className="text-sm text-slate-500">Your Appointment ({doctorDetails.specialization})</p>
                      )}

                      <div className="text-sm text-slate-600 mt-2">
                        {currentUser?.type === 'doctor' && (
                             <p className="flex items-center"><UserCircleIcon className="w-4 h-4 mr-2 text-slate-500" />Booked by: <span className="font-medium ml-1">{app.patientName}</span></p>
                        )}
                        {currentUser?.type === 'patient' && (
                            <p className="flex items-center"><UserCircleIcon className="w-4 h-4 mr-2 text-slate-500" />Patient: <span className="font-medium ml-1">{app.patientName}</span></p>
                        )}
                        <p className="flex items-center mt-1"><ClockIcon className="w-4 h-4 mr-2 text-slate-500" />Time: <span className="font-medium ml-1">{app.appointmentTime}</span></p>
                        {app.notes && <p className="flex items-start mt-1"><InformationCircleIcon className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />Notes: <span className="font-medium ml-1 text-slate-500 italic">{app.notes}</span></p>}
                      </div>
                    </div>
                    {currentUser?.type === 'patient' && ( 
                      <button
                        onClick={() => onCancelAppointment(app.id)}
                        className="mt-3 sm:mt-0 self-center sm:self-start bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center"
                        aria-label={`Cancel appointment with ${app.doctorName} at ${app.appointmentTime}`}
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-8 text-right">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg font-semibold shadow-md transition-colors"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsModal;