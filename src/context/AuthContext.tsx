import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser, checkAuthStatus } from '../services/AuthService';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthContextData {
    userId: number | null;
    isAuthenticated: boolean;
    userRole: string;
    login: (username: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>('')

    useEffect(() => {
        const checkUserStorage = async () => {
            const userStorage = await AsyncStorage.getItem("user");
            if (userStorage) {
                const userStorageObject = JSON.parse(userStorage)
                setUserId(userStorageObject.id)
                setIsAuthenticated(true)
                setUserRole(userStorageObject.roles[0].name)
            }
        }
        checkUserStorage()
    }, [])


    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                if (userId == null) {
                    console.error("UserID not found");
                    return
                }
                const user = await checkAuthStatus(userId);
                if (user) {
                    setUserId(user.id);
                    setUserRole(user.roles[0])
                    setIsAuthenticated(true);
                }
            }
        };
        checkAuth();
    }, [userId]);

    useEffect(() => {
        if (Platform.OS == 'windows') {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                // Verifica si es una recarga o un cierre de ventana
                const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
                const navType = navigationEntries.length > 0 ? navigationEntries[0].type : '';

                // Si NO es una recarga, ejecuta el logout
                if (navType !== 'reload') {
                    logout()
                }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, []);

    const login = async (username: string, password: string): Promise<string | null> => {
        try {
            const user = await loginUser(username, password);
            if (user) {
                setUserId(user.id);
                setIsAuthenticated(true);
                setUserRole(user.roles[0])
                await AsyncStorage.setItem('user', JSON.stringify(user));
                return null;
            } else {
                return 'Invalid username or password';
            }
        } catch (error) {
            return 'Error logging in. Please try again.';
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setUserId(null);
        await logoutUser();
        await AsyncStorage.removeItem('user');
    };
    const filteredChildren = React.Children.toArray(children).filter(child => {
        return typeof child !== 'string' || child.trim() !== '';
    });

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userRole, login, logout }}>
            {filteredChildren}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

