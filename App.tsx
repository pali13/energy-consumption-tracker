import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import BottomTabNavigator from './src/component/BottomTabNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ApplianceProvider } from './src/context/ApplianceContext';
import { TariffProvider } from './src/context/TariffContext';
import { DailyConsumptionProvider } from './src/context/DailyConsumptionContext';
import { WebSocketProvider } from './src/context/WebSocketContext';
import AppNavigator from './src/component/AppNavigator';


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
