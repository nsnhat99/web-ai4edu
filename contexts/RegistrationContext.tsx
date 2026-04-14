import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Registration } from '../types';
import * as api from '../api';

interface RegistrationContextType {
  registrations: Registration[];
  addRegistration: (formData: Omit<Registration, 'id'>) => Promise<void>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    api.getRegistrations()
      .then(setRegistrations)
      .catch(err => console.error("Failed to fetch registrations:", err));
  }, []);

  const addRegistration = async (formData: Omit<Registration, 'id'>) => {
    const newRegistration = await api.addRegistration(formData);
    setRegistrations(prevRegistrations => [newRegistration, ...prevRegistrations]);
  };

  return (
    <RegistrationContext.Provider value={{ registrations, addRegistration }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrations = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistrations must be used within a RegistrationProvider');
  }
  return context;
};
