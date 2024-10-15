import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { getConsumptionsBetweenDates } from "../services/DailyConsumptionService";
import { useAuth } from "../context/AuthContext";
import { DailyConsumption } from "../class/dailyConsumption";
import Spinner from "./elements/Spinner";

interface ConsumptionBetweenDatesProps {
  startDay: Date,
  endDay: Date
}

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const ConsumptionBetweenDates: React.FC<ConsumptionBetweenDatesProps> = ({ startDay, endDay }) => {
  const { userId } = useAuth();
  const [consumption, setConsumption] = useState<DailyConsumption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const start = formatDateToString(startDay);
  const end = formatDateToString(endDay);

  useEffect(() => {
    setLoading(true)
    const interval = setInterval(() => {

      const fetchConsumption = async () => {
        try {
          setLoading(true); // Activar el indicador de carga
          const data = await getConsumptionsBetweenDates(userId!, start, end);
          setConsumption(data);
        } catch (error) {
          console.error('Error fetching consumption:', error);
        } finally {
          setLoading(false); // Desactivar el indicador de carga
        }
      };

      fetchConsumption(); // Llamar a la función asíncrona dentro de useEffect
    }, 10000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [userId, startDay, endDay]); // Ejecutar useEffect cuando cambien estas dependencias

  if (loading) {
    return <Spinner message={"Cargando consumo..."} />;
  }

  return (
    <View style={styles.container}>
      {startDay.getFullYear() == endDay.getFullYear() && startDay.getMonth() == endDay.getMonth() && startDay.getDay() == endDay.getDay() ? (
        <View style={styles.oneDate}>
          <Text style={styles.dateText}>
            Día: {startDay.getDate()}/{startDay.getMonth() + 1}/{startDay.getFullYear()}
          </Text>
        </View>
      ) : (
        <View style={styles.twoDates}>
          <Text style={styles.dateText}>
            Desde: {startDay.getDate()}/{startDay.getMonth() + 1}/{startDay.getFullYear()}
          </Text>
          <Text style={styles.dateText}>
            Hasta: {endDay.getDate()}/{endDay.getMonth() + 1}/{endDay.getFullYear()}
          </Text>
        </View>
      )}
      <Text style={styles.consumptionText}>
        Consumo: {consumption.reduce((total, day) => total + day.consumption, 0).toFixed(5)} kWh
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
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
    fontSize: 16,
    marginBottom: 8,
  },
  consumptionText: {
    fontSize: 14,
    backgroundColor: '#c5d3eb',
    padding: 10,
    color: '#333',
    width: "55%",
    margin: "auto",
    borderRadius: 10,
    fontWeight: 'bold'
  },
  oneDate: {
    margin: 'auto'
  },
  twoDates: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});


export default ConsumptionBetweenDates;
