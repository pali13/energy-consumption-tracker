import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import LoginScreen from './src/authentication/LoginScreen';
// import BottomTabNavigator from './src/component/BottomTabNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { registerDailyConsumption } from './src/class/dailyConsumptionHelper';
import RegisterScreen from './src/authentication/RegisterScreen';
import { ApplianceProvider } from './src/context/ApplianceContext';
import { TariffProvider } from './src/context/TariffContext';
import { DailyConsumptionProvider } from './src/context/DailyConsumptionContext';
import { WebSocketProvider } from './src/context/WebSocketContext';
import AppNavigator from './src/component/AppNavigator';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const App: React.FC = () => {
  return (
      <NavigationContainer>
        <AuthProvider> {/* AuthProvider se coloca arriba */}
          <WebSocketProvider> {/* WebSocketProvider sigue a AuthProvider */}
            <ApplianceProvider>
              <TariffProvider>
                <DailyConsumptionProvider>
                  <AppNavigator />
                </DailyConsumptionProvider>
              </TariffProvider>
            </ApplianceProvider>
          </WebSocketProvider>
        </AuthProvider>
      </NavigationContainer>
  );
};

export default App;
