import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Asumiendo que tienes un AuthContext para manejar la autenticación
import { ApplianceService } from '../services/ApplianceService'; // Asumiendo que tienes un servicio para manejar las peticiones al backend
import { View, Switch, FlatList, StyleSheet, Text } from 'react-native';
import { Appliance } from '../class/appliance';
import { useAppliances } from '../context/ApplianceContext';
import { getTariff, getTodayDate } from '../helpers/helpers';
import { Tariff } from '../class/tariff';
import { calculateConsumption } from '../helpers/applianceUtils';  // Importa la función
import { saveConsumption } from '../services/DailyConsumptionService';
import { DailyConsumption } from '../class/dailyConsumption';
import { useWebSocket } from "../context/WebSocketContext";

const ApplianceManager: React.FC = () => {
    const { userId } = useAuth();
    const { appliances, setAppliances, refreshAppliances } = useAppliances();
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const { updateConsumptionData } = useWebSocket();

    useEffect(() => {
        const initialize = async () => {
            await refreshAppliances();
            setLoading(false);
        };

        initialize();
    }, []);

    const renderAppliance = ({ item }: { item: Appliance }) => (
        <View style={styles.applianceContainer}>
            <Text style={styles.applianceName}>{item.name}</Text>
            <Switch
                value={item.status}
                onValueChange={() => handleToggle(item.id!)}
            />
        </View>
    );

    const handleToggle = async (applianceId: number) => {
        let tariffType = '';
        if (!userId) {
            return
        }
        try {
            const tariff: Tariff = await getTariff(userId);
            const peakStartTime = tariff.peakStartTime;
            const peakEndTime = tariff.peakEndTime;
            tariffType = tariff.type;
            setStart(parseInt(peakStartTime.split(':')[0], 10));
            setEnd(parseInt(peakEndTime.split(':')[0], 10));
        } catch (error) {
            console.error("Error al obtener la tarifa:", error);
        }

        const applianceToUpdate = appliances.find(appliance => appliance.id === applianceId);
        if (!applianceToUpdate) {
            console.error("Appliance not found");
            return;
        }

        const currentTime = new Date();
        const formattedTime = currentTime.toISOString();

        if (!applianceToUpdate.status) {
            applianceToUpdate.lastOnTime = formattedTime;
        } else {
            applianceToUpdate.lastOffTime = formattedTime;
        }
        const { peakUsage, offPeakUsage, midPeakUsage } = calculateConsumption(applianceToUpdate, currentTime, start, end, tariffType);

        if (peakUsage! > 0 || offPeakUsage > 0 || midPeakUsage > 0) {
            const date = getTodayDate();
            const dailyConsumption: DailyConsumption = {
                date: date,
                appliance: applianceToUpdate,
                consumption: peakUsage + offPeakUsage + midPeakUsage,
                peakUsage: peakUsage,
                midPeakUsage: midPeakUsage,
                offPeakUsage: offPeakUsage
            };
            saveConsumption(userId, dailyConsumption) // Aquí podrías enviar este consumo al backend si lo necesitas
            .then(() => {
                // Actualiza manualmente el consumptionData al apagar el aparato
                updateConsumptionData(peakUsage + offPeakUsage + midPeakUsage);
            })
            .catch(err => console.error('Error al guardar el consumo:', err));
        }

        // Actualiza el estado del aparato
        const updatedAppliance = {
            ...applianceToUpdate,
            status: !applianceToUpdate.status,
            lastToggleTime: currentTime
        };

        try {
            // Actualiza el estado local de los aparatos
            setAppliances(prevAppliances =>
                prevAppliances.map(appliance =>
                    appliance.id === applianceId ? updatedAppliance : appliance
                )
            );

            // Envía la solicitud PUT al backend
            await ApplianceService.update(userId, updatedAppliance);
        } catch (error) {
            console.error("Error updating appliance:", error);
        }
    };

    return (
        <View>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                appliances.length > 0 ? (
                    <FlatList data={appliances} renderItem={renderAppliance} keyExtractor={item => item.id!.toString()} />
                ) : (
                    <Text>¡Lista vacía!</Text>
                )
            )}
        </View>
    );
};

export default ApplianceManager;

const styles = StyleSheet.create({
    applianceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    applianceName: { fontSize: 18 },
});