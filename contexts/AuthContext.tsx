
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { PatientUser, DoctorUser, CurrentUser } from '../types';
import { HARDCODED_DOCTOR_CREDENTIALS } from '../constants';

interface AuthContextType {
  currentUser: CurrentUser;
  loginPatient: (email: string, password: string) => Promise<boolean>;
  signupPatient: (name: string, email: string, password: string) => Promise<boolean>;
  loginDoctor: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const getPatientUsers = useCallback((): PatientUser[] => {
    const users = localStorage.getItem('patientUsers');
    return users ? JSON.parse(users) : [];
  }, []);

  const savePatientUsers = useCallback((users: PatientUser[]) => {
    localStorage.setItem('patientUsers', JSON.stringify(users));
  }, []);

  const loginPatient = useCallback(async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/auth/patient/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setIsLoading(false);
      return false;
    }
    const user = await response.json();
    setCurrentUser(user);
    setIsLoading(false);
    return true;
  } catch (err) {
    setIsLoading(false);
    return false;
  }
}, []);

  const signupPatient = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/auth/patient/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      setIsLoading(false);
      return false;
    }
    const user = await response.json();
    setCurrentUser(user);
    setIsLoading(false);
    return true;
  } catch (err) {
    setIsLoading(false);
    return false;
  }
}, []);

  const loginDoctor = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const doctorCredential = HARDCODED_DOCTOR_CREDENTIALS.find(
      doc => doc.username === username && doc.password === password
    );
    if (doctorCredential) {
      const doctorUser: DoctorUser = {
        id: doctorCredential.doctorId,
        username: doctorCredential.username,
        name: doctorCredential.name,
        type: 'doctor',
      };
      setCurrentUser(doctorUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loginPatient, signupPatient, loginDoctor, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
