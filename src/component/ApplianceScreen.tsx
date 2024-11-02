import { Appliance } from '../class/appliance';
import { ApplianceService } from '../services/ApplianceService';
import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import CustomHeader from './CustomHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppliances } from '../context/ApplianceContext';

const ApplianceScreen: React.FC = () => {
    const { userId } = useAuth();
    const { appliances, setAppliances, refreshAppliances } = useAppliances();
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAppliance, setSelectedAppliance] = useState<Appliance>({
        id: 0,
        name: '',
        type: '',
        powerRating: 0,
        status: false,
        location: '',
        lastOnTime: '',
        lastOffTime: '',
        dailyUsage: 0,
        peakUsage: 0,
        offPeakUsage: 0,
        totalUsage: 0,
        dailyConsumptions: []
    });

    const [newAppliance, setNewAppliance] = useState({
        name: '',
        type: '',
        powerRating: 0,
        status: false,
        location: '',
        lastOnTime: '',
        lastOffTime: '',
        dailyUsage: 0,
        peakUsage: 0,
        offPeakUsage: 0,
        totalUsage: 0,
    });

    const handleSaveAppliance = async () => {
        if (isEditMode) {
            // Lógica de edición
            if (selectedAppliance) {
                await ApplianceService.update(userId, selectedAppliance);
                setAppliances(appliances.map(appliance =>
                    appliance.id === selectedAppliance.id ? selectedAppliance : appliance
                ));
                setIsFormOpen(false);
            }
        } else {
            // Lógica de creación
            if (newAppliance.name && newAppliance.type && newAppliance.powerRating && userId) {
                const addedAppliance = await ApplianceService.create(userId, new Appliance(
                    newAppliance.name,
                    newAppliance.type,
                    newAppliance.powerRating,
                    newAppliance.status ?? false,
                    newAppliance.location,
                    newAppliance.lastOnTime,
                    newAppliance.lastOffTime,
                    newAppliance.dailyUsage,
                    newAppliance.peakUsage,
                    newAppliance.offPeakUsage,
                    newAppliance.totalUsage
                ));
                setAppliances([...appliances, addedAppliance]);
                setIsFormOpen(false); // Cerrar el formulario después de agregar el nuevo aparato
                setNewAppliance({ // Resetear el formulario
                    name: '',
                    type: '',
                    powerRating: 0,
                    status: false,
                    location: '',
                    lastOnTime: '',
                    lastOffTime: '',
                    dailyUsage: 0,
                    peakUsage: 0,
                    offPeakUsage: 0,
                    totalUsage: 0,
                });
                await refreshAppliances();
            }
        }
        setIsFormOpen(false);
    };

    const handleDeleteAppliance = async (id: number, userId: number) => {
        await ApplianceService.delete(id, userId);
        setAppliances(appliances.filter(appliance => appliance.id !== id));
        await refreshAppliances();
    };

    const handleEditAppliance = async (applianceId: number) => {
        setIsEditMode(true);

        try {
            const data = await ApplianceService.getById(applianceId, userId!)

            // Actualiza el estado con los datos obtenidos
            setSelectedAppliance({
                id: data.id,
                name: data.name,
                type: data.type,
                powerRating: data.powerRating,
                status: data.status,
                location: data.location,
                lastOnTime: data.lastOnTime,
                lastOffTime: data.lastOffTime,
                dailyUsage: data.dailyUsage,
                peakUsage: data.peakUsage,
                offPeakUsage: data.offPeakUsage,
                totalUsage: data.totalUsage,
                dailyConsumptions: data.dailyConsumptions
            });

            // Abre el modal
            setIsFormOpen(true);
        } catch (error) {
            console.error("Error al cargar el aparato:", error);
        }
    };

    const handleInputChange = (name: string, value: string) => {
        if (isEditMode) {
            setSelectedAppliance({ ...selectedAppliance, [name]: value });
        } else {
            setNewAppliance({ ...newAppliance, [name]: value });
        }
    };

    return (
        <ScrollView style={Platform.OS == 'web' ? styles.containerWeb : null}>
            <CustomHeader
                title="Aparatos"
                logo={require('../../assets/images/logo.jpg')} // Asegúrate de que la ruta sea correcta
            />
            <View>
                <Pressable style={styles.addPressable} onPress={() => setIsFormOpen(true)}>
                    <Text style={styles.addPressableText}>Agregar aparato</Text>
                    <Icon name="plus" size={20} color="white" />
                </Pressable>

                <Modal
                    visible={isFormOpen}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsFormOpen(false)}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{isEditMode ? 'Editar Aparato' : 'Agregar Aparato'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={isEditMode ? selectedAppliance.name : newAppliance.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tipo del Dispositivo"
                            value={isEditMode ? selectedAppliance.type : newAppliance.type}
                            onChangeText={(value) => handleInputChange('type', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Potencia por hora"
                            keyboardType="numeric"
                            value={isEditMode ? String(selectedAppliance.powerRating) : String(newAppliance.powerRating)}
                            onChangeText={(value) => handleInputChange('powerRating', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ubicación"
                            value={isEditMode ? selectedAppliance.location : newAppliance.location}
                            onChangeText={(value) => handleInputChange('location', value)}
                        />
                        <View style={styles.modalActions}>
                            <Pressable style={styles.addPressable} onPress={() => setIsFormOpen(false)}>
                                <Text style={styles.addPressableText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={styles.addPressable} onPress={handleSaveAppliance}>
                                <Text style={styles.addPressableText}>{isEditMode ? 'Guardar Cambios' : 'Agregar'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>


                {appliances.map((appliance) => (
                    <View key={appliance.id} style={styles.applianceCard}>
                        <Text style={styles.applianceText}>Nombre: {appliance.name}</Text>
                        <Text style={styles.applianceText}>Potencia: {appliance.powerRating} W</Text>
                        <Text style={styles.applianceText}>Ubicación: {appliance.location}</Text>

                        <View style={styles.iconPressableContainer}>
                            <Pressable onPress={() => handleEditAppliance(appliance.id!)}>
                                <Icon name="edit" size={20} color="blue" style={styles.iconPressable} />
                            </Pressable>
                            <Pressable onPress={() => handleDeleteAppliance(appliance.id!, userId!)}>
                                <Icon name="trash" size={20} color="red" style={styles.iconPressable} />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    addPressable: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 10,
        margin: 'auto',
        width: '49%',
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
    },
    addPressableText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
    },
    applianceCard: {
        padding: 10,
        margin: 5,
        marginVertical: 5,
        backgroundColor: '#eaeaea',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8
    },
    applianceText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    iconPressableContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconPressable: {
        marginLeft: 15,
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        padding: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    card: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        marginBottom: 16,
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    containerWeb: {
        padding: 50,
    },
});

export default ApplianceScreen;