import React, { useState, useCallback, useEffect } from 'react';
import { Doctor, Appointment, ModalType } from './types';
import { DOCTORS_DATA } from './constants';
import Header from './components/Header';
import DoctorCard from './components/DoctorCard';
import BookingModal from './components/BookingModal';
import MyAppointmentsModal from './components/MyAppointmentsModal';
import Alert from './components/Alert';
import AuthModal from './components/AuthModal';
import DoctorLoginModal from './components/DoctorLoginModal';
import DoctorSchedule from './components/DoctorSchedule'; // Import DoctorSchedule component
import { useAuth } from './contexts/AuthContext';
import { UserIcon, InformationCircleIcon } from './components/IconComponents';

const App: React.FC = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS_DATA);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const showAlert = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), duration);
  }, []);

  // Fetch appointments from backend on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch('/api/appointments', {
          headers: {
            'x-user-type': currentUser.type,
            'x-user-id': currentUser.id,
            'x-user-name': currentUser.name,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          showAlert(errorData.message || 'Failed to fetch appointments', 'error', 5000);
          throw new Error(errorData.message || 'Failed to fetch appointments');
        }
        const data = await response.json();
        // Ensure frontend uses a consistent field name
        const normalized = data.map((item: any) => ({
          ...item,
          id: item._id || item.id, // ensure unique identifier exists
          appointmentTime: item.appointmentTime || item.slot,
        }));
        setAppointments(normalized);
      } catch (error: any) {
        showAlert(error.message || 'Could not load appointments. Please try again.', 'error', 5000);
        // Optionally fallback to localStorage
        const savedAppointments = localStorage.getItem('appointments');
        if (savedAppointments) {
          setAppointments(JSON.parse(savedAppointments));
        }
      }
    };
    fetchAppointments();
    // Only re-run when user changes
  }, [currentUser, showAlert]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleOpenBookingModal = useCallback((doctor: Doctor) => {
    if (currentUser && currentUser.type === 'patient') {
      setSelectedDoctor(doctor);
      setActiveModal(ModalType.BOOKING);
    } else if (currentUser && currentUser.type === 'doctor') {
      showAlert('Doctors cannot book appointments. Please use a patient account.', 'info', 5000);
    } 
    else {
      showAlert('Please log in as a patient to book an appointment.', 'info', 5000);
      setActiveModal(ModalType.AUTH_PATIENT);
    }
  }, [currentUser, showAlert]);

  const handleCloseModal = useCallback(() => {
    setActiveModal(ModalType.NONE);
    setSelectedDoctor(null);
  }, []);

  const handleConfirmBooking = useCallback(async (patientName: string, appointmentTime: string, notes?: string, gender?: string, age?: number) => {
    if (!selectedDoctor || !currentUser || currentUser.type !== 'patient') {
        showAlert('Error booking appointment. Please ensure you are logged in as a patient.', 'error');
        return;
    }

    try {
      showAlert('Booking appointment...', 'info');
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-patient-name': patientName,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          slot: appointmentTime,
          gender,
          age,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showAlert(errorData.message || 'Failed to book appointment.', 'error');
        return;
      }

      const data = await response.json();
      // Update frontend state with new appointment (add doctorName, patientId, notes for local state)
      const newAppointment: Appointment = {
        id: data._id || Date.now().toString(),
        doctorId: data.doctorId,
        doctorName: selectedDoctor.name,
        patientName: data.patientName,
        patientId: currentUser.id,
        appointmentTime: data.slot,
        notes,
        gender: data.gender,
        age: data.age,
      };

      setAppointments(prev => [...prev, newAppointment]);
      showAlert('Appointment booked successfully!', 'success');
      handleCloseModal();
    } catch (err) {
      showAlert('Network error. Please try again.', 'error');
    }
  }, [selectedDoctor, currentUser, handleCloseModal, showAlert, setAppointments]);

  const handleCancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    showAlert('Appointment cancelled.', 'info');
  }, [showAlert]);

  const handleShowMyBookings = useCallback(() => {
     if (!currentUser) {
        showAlert('Please log in to view your appointments or schedule.', 'info', 5000);
        setActiveModal(ModalType.AUTH_PATIENT); 
        return;
    }
    setActiveModal(ModalType.MY_APPOINTMENTS);
  }, [currentUser, showAlert]);
  
  const handleAuthSuccess = useCallback(() => {
    // Message is shown by AuthModal itself or login/signup functions for more specific feedback.
    // This can be used for additional actions if needed after auth success.
    // showAlert('Login successful!', 'success');
    handleCloseModal(); // Close auth modal
  }, [handleCloseModal]);

  const isSlotBooked = useCallback((doctorId: string, timeSlot: string): boolean => {
    return appointments.some(app => app.doctorId === doctorId && app.appointmentTime === timeSlot);
  }, [appointments]);

  const uniqueSpecializations = Array.from(new Set(DOCTORS_DATA.map(doc => doc.specialization)));

  const filteredDoctors = doctors.filter(doctor => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm = doctor.name.toLowerCase().includes(searchTermLower) ||
                              doctor.specialization.toLowerCase().includes(searchTermLower) ||
                              doctor.location.toLowerCase().includes(searchTermLower) || // Search by OPD name
                              doctor.city.toLowerCase().includes(searchTermLower);      // Search by city
    const matchesSpecialization = selectedSpecialization ? doctor.specialization === selectedSpecialization : true;
    return matchesSearchTerm && matchesSpecialization;
  });

  // Update appointment status when doctor marks it as done/no_show/cancelled
  const handleUpdateAppointmentStatus = useCallback(async (appointmentId: string, status: 'done' | 'no_show' | 'cancelled') => {
    // Optimistic update UI first
    setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status } : app));
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      const updated = await res.json();
      setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: updated.status } : app));
    } catch (err) {
      showAlert('Could not update status on server.', 'error');
      // Revert optimistic update
      setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'upcoming' } : app));
    }
  }, [showAlert]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl text-slate-700">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col"> {/* Updated background */}
      <Header 
        onShowMyBookings={handleShowMyBookings} 
        onShowPatientAuthModal={() => setActiveModal(ModalType.AUTH_PATIENT)}
        onShowDoctorAuthModal={() => setActiveModal(ModalType.AUTH_DOCTOR)}
      />
      
      {alertMessage && <Alert message={alertMessage} type={alertType} onClose={() => setAlertMessage(null)} />}

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-md shadow-lg rounded-xl"> {/* Kept backdrop-blur, refined shadow */}
          {currentUser?.type !== 'doctor' && (
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Find Your Doctor</h2>
          )}
          {currentUser?.type !== 'doctor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Search by name, specialization, OPD, city..."
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for doctors by name or specialization"
              />
              <select
                className="w-full p-3 border border-slate-500 bg-slate-700 text-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                aria-label="Filter doctors by specialization"
              >
                <option value="" className="text-slate-500 bg-white">All Specializations</option>
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec} className="text-slate-800 bg-white">{spec}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {currentUser?.type === 'doctor' ? (
          <DoctorSchedule appointments={appointments} onUpdateStatus={handleUpdateAppointmentStatus} />
        ) : (
          filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  onBookAppointment={handleOpenBookingModal} 
                  isSlotBooked={(slot) => isSlotBooked(doctor.id, slot)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <UserIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-xl text-slate-600">No doctors found matching your criteria.</p>
              <p className="text-slate-500">Try adjusting your search or filter.</p>
            </div>
          )
        )}
      </main>

      {activeModal === ModalType.BOOKING && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          onConfirmBooking={handleConfirmBooking}
          isSlotBooked={(slot) => isSlotBooked(selectedDoctor.id, slot)}
        />
      )}

      {activeModal === ModalType.MY_APPOINTMENTS && currentUser && (
        <MyAppointmentsModal
          appointments={appointments}
          onClose={handleCloseModal}
          onCancelAppointment={handleCancelAppointment}
          doctors={doctors}
          currentUser={currentUser}
        />
      )}
      
      {activeModal === ModalType.AUTH_PATIENT && (
        <AuthModal onClose={handleCloseModal} onSuccess={handleAuthSuccess} />
      )}
      {activeModal === ModalType.AUTH_DOCTOR && (
        <DoctorLoginModal onClose={handleCloseModal} onSuccess={handleAuthSuccess} />
      )}
      
      <footer className="bg-slate-900 text-slate-200 text-center p-6 mt-auto"> {/* Updated footer style */}
        <p>&copy; {new Date().getFullYear()} QuickCare. All rights reserved.</p>
        <p className="text-sm text-slate-400">Your health, our priority.</p> {/* Subtler text for secondary line */}
         {!currentUser && (
            <button 
                onClick={() => setActiveModal(ModalType.AUTH_DOCTOR)} 
                className="text-xs text-sky-400 hover:text-sky-300 mt-2 p-1 transition-colors"
            >
                Doctor Portal Access
            </button>
        )}
      </footer>
    </div>
  );
};

export default App;
