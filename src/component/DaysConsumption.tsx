import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import Day from "../class/day";
import { useAppliances } from "../context/ApplianceContext";
import { useWebSocket } from "../context/WebSocketContext";

interface DaysConsumptionProps {
  day: Day
}

const DaysConsumption: React.FC<DaysConsumptionProps> = ({ day }) => {
  const { consumptionData } = useWebSocket(); // Datos recibidos del WebSocket
  const { appliances } = useAppliances(); // Aparatos
  const [realTimeConsumption, setRealTimeConsumption] = useState<number>(0); // Consumo en tiempo real
  const [totalConsumption, setTotalConsumption] = useState<number>(0); // Consumo total

  // Función para calcular el consumo en tiempo real
  const calculateRealTimeConsumption = () => {
    let currentRealTimeConsumption = 0;

    appliances.forEach((appliance) => {
      if (appliance.status) { // Si el aparato está encendido
        const lastOnTimeDate = new Date(appliance.lastOnTime!); // Convierte el string a Date
        const timeOn = new Date().getTime() - lastOnTimeDate.getTime(); // Calcula la diferencia en milisegundos
        const consumption = (appliance.powerRating * timeOn) / (1000 * 3600); // Convertir a kWh
        currentRealTimeConsumption += parseFloat(consumption.toFixed(5)); // Redondea a 5 decimales
      }
    });

    return currentRealTimeConsumption;
  };

  // Actualiza el consumo en tiempo real cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newRealTimeConsumption = calculateRealTimeConsumption(); // Calcula el consumo en tiempo real local
      setRealTimeConsumption(newRealTimeConsumption);

      // Suma el consumo guardado en la base de datos + el consumo en tiempo real local
      setTotalConsumption(prevTotal => consumptionData + newRealTimeConsumption);
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [appliances, consumptionData]); // Se ejecuta cuando los aparatos o el consumoData cambian

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>
        Día: {day.date.getDate()}/{day.date.getMonth() + 1}/{day.date.getFullYear()}
      </Text>
      <Text style={styles.consumptionText}>
        Consumo: {totalConsumption.toFixed(5)} kWh
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Only for Android
    margin: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  consumptionText: {
    fontSize: 16,
    color: '#333',
  },
});


export default DaysConsumption;
