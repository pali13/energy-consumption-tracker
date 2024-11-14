import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Platform } from 'react-native';
import CustomHeader from './CustomHeader';
import { TariffService } from '../services/TariffService';
import { useAuth } from '../context/AuthContext';
import { TariffRequest } from '../class/tariffRequest';
import { useTariff } from '../context/TariffContext';
import Spinner from './elements/Spinner';

type TariffKey = 'standard' | 'double' | 'triple';

const tariffs: Record<TariffKey, { label: string; prices: { period?: string; range?: string; price: number; }[] }> = {
  standard: {
    label: "Tarifa estándar",
    prices: [
      { range: "1-100 kWh", price: 6.483 },
      { range: "101-600 kWh", price: 8.126 },
      { range: "601+ kWh", price: 10.132 },
    ]
  },
  double: {
    label: "Tarifa Residencial Doble Horario",
    prices: [
      { period: "Horario Punta", price: 11.032 },
      { period: "Horario Fuera de Punta", price: 4.422 },
    ]
  },
  triple: {
    label: "Tarifa Residencial Triple Horario",
    prices: [
      { period: "Horario Punta", price: 11.032 },
      { period: "Horario Valle", price: 2.298 },
      { period: "Horario Llano", price: 5.036 },
    ]
  }
};

const peakHourOptions = [
  { label: '17:00 - 21:00', value: '17-21' },
  { label: '18:00 - 22:00', value: '18-22' },
  { label: '19:00 - 23:00', value: '19-23' },
];

const TariffScreen = () => {
  const { tariff } = useTariff();
  const [selectedTariff, setSelectedTariff] = useState<TariffKey>('standard');
  const [selectedPeakHour, setSelectedPeakHour] = useState('17-21');
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false); // Estado para controlar el spinner
  const [message, setMessage] = useState<string | null>(null); // Estado para el mensaje de confirmación

  useEffect(() => {
    if (tariff) {
      let newSelectedTariff: TariffKey = 'standard';
      if (tariff.tariffId === 3) {
        newSelectedTariff = 'double';
      } else if (tariff.tariffId === 4) {
        newSelectedTariff = 'triple';
      }
      setSelectedTariff(newSelectedTariff);

      if (tariff.peakStartTime && tariff.peakEndTime) {
        const startHour = tariff.peakStartTime.split(':')[0];
        const endHour = tariff.peakEndTime.split(':')[0];
        const formattedTimeRange = `${startHour}-${endHour}`;
        setSelectedPeakHour(formattedTimeRange);
      }
    }
  }, [tariff]);

  const handleSave = async () => {
    if (!userId) {
      throw new Error("UserId is null");
    }

    setLoading(true);
    setMessage(null);

    const [startTime, endTime] = selectedPeakHour.split('-');
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;
    let tariffId;
    if (selectedTariff == 'standard') {
      tariffId = 2;
    }
    if (selectedTariff == 'double') {
      tariffId = 3;
    }
    if (selectedTariff == 'triple') {
      tariffId = 4;
    }
    if (!tariffId) {
      throw new Error("TariffId is null");
    }
    const tariff = new TariffRequest(tariffId, formattedStartTime, formattedEndTime)
    const newTariff = await TariffService.assignTariff(userId, tariff)
    setTimeout(() => {
      setLoading(false);
      let confirmationMessage;
      if (newTariff.tariffId === 1) {
        confirmationMessage = "Tarifa estándar asignada con éxito.";
      } else if (newTariff.tariffId === 3) {
        confirmationMessage = "Tarifa Residencial Doble Horario asignada con éxito.";
      } else if (newTariff.tariffId === 4) {
        confirmationMessage = "Tarifa Residencial Triple Horario asignada con éxito.";
      }
      setMessage(confirmationMessage!);
    }, 5000);
  };

  useEffect(() => {
    // Mostrar el mensaje por 5 segundos y luego ocultarlo
    const timer = setTimeout(() => {
      setMessage(null);
    }, 7000);

    // Limpiar el timeout cuando el componente se desmonte o el mensaje cambie
    return () => clearTimeout(timer);
  }, [message]);

  return (
      <ScrollView style={Platform.OS == 'web' ? styles.containerWeb : null}>
        <CustomHeader title={'Tarifas'} logo={require('../../assets/images/logo.jpg')} />
        <View style={styles.container}>
          <Text style={styles.label}>Tarifa contratada</Text>
          <Picker
            selectedValue={selectedTariff}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTariff(itemValue as TariffKey)}
          >
            <Picker.Item label="Tarifa estándar" value="standard" />
            <Picker.Item label="Tarifa Residencial Doble Horario" value="double" />
            <Picker.Item label="Tarifa Residencial Triple Horario" value="triple" />
          </Picker>
          {(selectedTariff === 'double' || selectedTariff === 'triple') && (
            <>
              <Text style={styles.label}>Horario Punta</Text>
              <Picker
                selectedValue={selectedPeakHour}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedPeakHour(itemValue as string)}
              >
                {peakHourOptions.map(option => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </>
          )}
          <View style={styles.pricesContainer}>
            {tariffs[selectedTariff].prices.map((item, index) => (
              <Text key={index} style={styles.priceText}>
                {item.range || item.period}: ${item.price.toFixed(3)} / kWh
              </Text>
            ))}
          </View>
          <Pressable style={styles.addPressable} onPress={handleSave}>
            <Text style={styles.addPressableText}>Guardar</Text>
          </Pressable>
        </View>
        {loading && (
          <Spinner delay={5000} message={'Asignando tarifa...'} />
        )}

        {message && (
          <Text style={styles.confirmationMessage}>{message}</Text>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  pricesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 16,
    marginBottom: 4,
  },
  confirmationMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  addPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    margin: 'auto',
    borderRadius: 30,
    marginBottom: 20,
    width: '75%'
  },
  addPressableText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  containerWeb: {
    padding: 50,
},
});

export default TariffScreen;