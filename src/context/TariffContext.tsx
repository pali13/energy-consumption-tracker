import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTariff } from '../helpers/helpers';
import { Tariff } from '../class/tariff';
import { Text } from 'react-native';

interface TariffContextProps {
  tariff: Tariff | null;
  setTariff: React.Dispatch<React.SetStateAction<Tariff | null>>;
  refreshTariff: () => Promise<void>;
}

const TariffContext = createContext<TariffContextProps | undefined>(undefined);

export const TariffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [tariff, setTariff] = useState<Tariff | null>(null);

  const refreshTariff = async () => {
    if (userId) {
      try {
        const userTariff = await getTariff(userId);
        setTariff(userTariff);
      } catch (error) {
        console.error("Error al obtener la tarifa:", error);
      }
    }
  };

  useEffect(() => {
    refreshTariff();
  }, [userId]);

  return (
    <TariffContext.Provider value={{ tariff, setTariff, refreshTariff }}>
        {children}
    </TariffContext.Provider>
  );
};

export const useTariff = () => {
  const context = useContext(TariffContext);
  if (!context) {
    throw new Error('useAppliances must be used within an ApplianceProvider');
  }
  return context;
};
