import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApplianceScreen from './ApplianceScreen';
import HomeScreen from './HomeScreen';
import TariffScreen from './TariffScreen';
import TheoryInformation from './TheoryInformation';
import DaysHistory from './DaysHistory';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appliances" component={ApplianceScreen} />
      <Tab.Screen name="Tariff" component={TariffScreen} />
      <Tab.Screen name="Daily" component={DaysHistory} />
      <Tab.Screen name="Theory" component={TheoryInformation} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;