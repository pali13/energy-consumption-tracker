import { useEffect } from "react";
import LoginScreen from "../authentication/LoginScreen";
import { registerDailyConsumption } from "../class/dailyConsumptionHelper";
import { useAuth } from "../context/AuthContext";
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from "./BottomTabNavigator";
import RegisterScreen from "../authentication/RegisterScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      const now = new Date();
      if (isAuthenticated && userId !== null) {
        try {
          if (
            (now.getHours() === 0 && now.getMinutes() === 0)
          ) {
            await registerDailyConsumption(userId);
          }
        } catch (error) {
          console.error('Error initializing daily consumption:', error);
        }
      }
    };

    const intervalId = setInterval(() => {
      const now = new Date();
      if (
        (now.getHours() === 0 && now.getMinutes() === 0)
      ) {
        registerDailyConsumption(userId).catch(error =>
          console.error('Error registering daily consumption:', error)
        );
      }
    }, 60000); // Verificar cada minuto

    initialize();

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, userId]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Tab" component={BottomTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>

  );
};

export default AppNavigator;