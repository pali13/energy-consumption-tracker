import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApplianceScreen from './ApplianceScreen';
import HomeScreen from './HomeScreen';
import TariffScreen from './TariffScreen';
import TheoryInformation from './TheoryInformation';
import DaysHistory from './DaysHistory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name={'home'} size={size} color={color} />
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
          <Icon name="currency-usd" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Consumo" component={DaysHistory} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chart-box-outline" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Teoría" component={TheoryInformation} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="book" color={color} size={size} />
        ),
      }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;