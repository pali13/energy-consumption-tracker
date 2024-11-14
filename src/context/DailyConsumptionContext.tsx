import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodayDate } from '../helpers/helpers';
import { DailyConsumption } from '../class/dailyConsumption';
import { getTodayConsumption } from '../services/DailyConsumptionService';

interface DailyConsumptionContextProps {
  dailyConsumption: DailyConsumption | null;
  setDailyConsumption: React.Dispatch<React.SetStateAction<DailyConsumption | null>>;
  refreshDailyConsumption: () => Promise<void>;
}

const DailyConsumptionContext = createContext<DailyConsumptionContextProps | undefined>(undefined);

export const DailyConsumptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [dailyConsumption, setDailyConsumption] = useState<DailyConsumption | null>(null);

  const refreshDailyConsumption = async () => {
    if (userId) {
      try {
        const userConsumption = await getTodayConsumption(userId, getTodayDate());
        setDailyConsumption(userConsumption);
      } catch (error) {
        console.error("Error al obtener la tarifa:", error);
      }
    }
  };

  useEffect(() => {
    refreshDailyConsumption();
  }, [userId]);

  return (
    <DailyConsumptionContext.Provider value={{ dailyConsumption, setDailyConsumption, refreshDailyConsumption }}>
        {children}
    </DailyConsumptionContext.Provider>
  );
};

export const useDailyConsumption = () => {
  const context = useContext(DailyConsumptionContext);
  if (!context) {
    throw new Error('useAppliances must be used within an ApplianceProvider');
  }
  return context;
};
