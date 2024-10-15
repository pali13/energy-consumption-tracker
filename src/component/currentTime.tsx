import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getCurrentDay = () => {
    const day = String(currentTime.getDate()).padStart(2, '0');
    const month = String(currentTime.getMonth()+1).padStart(2, '0');
    const year = String(currentTime.getFullYear());
    return `${day}/${month}/${year}`;
  }

  const getCurrentTime = () => {
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <MaterialCommunityIcons name="calendar" size={30} color="#000" style={styles.icon} />
        <Text style={styles.text}>{getCurrentDay()}</Text>
      </View>
      <View style={styles.hour}>
        <MaterialIcons name="access-time" size={30} color="#000" style={styles.icon} />
        <Text style={styles.text}>{getCurrentTime()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    alignSelf: 'center'
  },
  calendar: {
    flexDirection: 'row', // Añadir esta línea
    alignItems: 'center', // Añadir esta línea
    padding: 5,
  },
  hour: {
    flexDirection: 'row',
    alignItems: 'center', // Añadir esta línea
    padding: 5,
    justifyContent: 'center'
  }
});

export default CurrentTime;
