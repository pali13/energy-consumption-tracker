import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApplianceScreen from './ApplianceScreen';
import HomeScreen from './HomeScreen';
import TariffScreen from './TariffScreen';
import TheoryInformation from './TheoryInformation';
import DaysHistory from './DaysHistory';
import Icon from 'react-native-vector-icons/Ionicons'; // Puedes usar la librería que prefieras

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Aparatos" component={ApplianceScreen} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="power-plug-outline" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Tarifas" component={TariffScreen} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="coins" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Consumo" component={DaysHistory} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="graph" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Teoría" component={TheoryInformation} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="open-book" color={color} size={size} />
        ),
      }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;