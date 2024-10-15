import React, { } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import CustomHeader from './CustomHeader';
import DaysConsumption from './DaysConsumption';
import Day from '../class/day';
import ApplianceManager from './ApplianceManager';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    
    const { isAuthenticated, login, logout } = useAuth();

    const handleLogoutClick = async () => {
        logout();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={Platform.OS == 'web' ? styles.containerWeb : null}>
            <CustomHeader title={'Home'} logo={require('../../assets/images/logo.jpg')} />
            <View>
                {isAuthenticated ? (
                    <>
                        <DaysConsumption day={new Day(new Date())} />
                        <ApplianceManager />
                        <TouchableOpacity style={styles.addButton} onPress={handleLogoutClick}>
                            <Text style={styles.addButtonText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <h2>Please log in.</h2>
                        <TouchableOpacity style={styles.addButton} onPress={() => login('username', 'password')}>
                            <Text style={styles.addButtonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    addButton: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 10,
        borderRadius: 30,
        marginBottom: 20,
        width: '75%',
        margin: 'auto'
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
    },
    containerWeb: {
        padding: 50,
    },
})

export default HomeScreen;

