import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appliance } from '../class/appliance';
import { getAppliances } from '../helpers/helpers';

interface ApplianceContextProps {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
  loading: boolean;
  refreshAppliances: () => Promise<void>;
}

const ApplianceContext = createContext<ApplianceContextProps | undefined>(undefined);

export const ApplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAppliances = async () => {
    if (userId) {
      try {
        const userAppliances = await getAppliances(userId);
        setAppliances(userAppliances);
      } catch (error) {
        console.error("Error al obtener los aparatos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshAppliances();
  }, [userId]);

  return (
    <ApplianceContext.Provider value={{ appliances, setAppliances, loading, refreshAppliances }}>
        {children}
    </ApplianceContext.Provider>
  );
};

export const useAppliances = () => {
  const context = useContext(ApplianceContext);
  if (!context) {
    throw new Error('useAppliances must be used within an ApplianceProvider');
  }
  return context;
};
