import React, { useState } from "react";
import { Pressable, Modal, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import CustomHeader from "./CustomHeader";
import ConsumptionBetweenDates from "./ConsumptionBetweenDates";
import DatePicker from "react-datepicker";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const DaysHistory: React.FC = () => {
    const [calendar, setCalendar] = useState<boolean>(false)
    const [calendar2, setCalendar2] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isRange, setIsRange] = useState<boolean>(false);
    const [startPicker, setStartPicker] = useState<boolean>(false);
    const [endPicker, setEndPicker] = useState<boolean>(false);

    const handleCalendar = () => {
        if (calendar2) {
            setCalendar2(false)
        }
        setCalendar(!calendar);
    }

    const handleCalendar2 = () => {
        if (calendar) {
            setCalendar(false)
        }
        setCalendar2(!calendar2);
    }

    const onChangeMobile = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setSelectedDate(selectedDate);  // Actualiza la fecha seleccionada en el estado
        }
        setCalendar(false);
        setIsRange(false)
    };

    const onChangeMobileStart = (event: DateTimePickerEvent, startDate?: Date) => {
        if (startDate) setStartDate(startDate);  // Actualiza la fecha seleccionada en el estado
        setStartPicker(false);
    };

    const onChangeMobileEnd = (event: DateTimePickerEvent, endDate?: Date) => {
        if (endDate) setEndDate(endDate);  // Actualiza la fecha seleccionada en el estado
        setEndPicker(false)
    };

    const handleConfirm = () => {
        setIsRange(true)
        setCalendar2(false)
    }

    return (
        <ScrollView style={Platform.OS == 'web' ? styles.containerWeb : null}>
            <CustomHeader
                title="Consumo histórico"
                logo={require('../../assets/images/logo.jpg')} // Asegúrate de que la ruta sea correcta
            />
            <View style={styles.container}>
                <Pressable style={styles.Pressable} onPress={handleCalendar}>
                    <Text style={styles.textPressable}>Consumo diario</Text>
                </Pressable>
                <Pressable style={styles.Pressable} onPress={handleCalendar2}>
                    <Text style={styles.textPressable}>Consumo personalizado</Text>
                </Pressable>
            </View>
            {calendar && (
                <Modal visible={calendar} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.textCalendar}>Seleccione fecha</Text>
                            {Platform.OS == 'web' ? (
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => {
                                        if (date) setSelectedDate(date);
                                        setCalendar(false);  // Cerrar modal al seleccionar fecha
                                        setIsRange(false)
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                />
                            ) : (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeMobile}
                                />
                            )
                            }
                        </View>
                    </View>
                </Modal>
            )}

            {calendar2 && (
                <Modal visible={calendar2} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Seleccione el rango de fechas</Text>
                            <Text style={styles.textCalendar}>Fecha de inicio</Text>
                            {Platform.OS == 'web' ? (
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) => {
                                        if (date) setStartDate(date);
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                />
                            ) : (
                                <>
                                    <Pressable onPress={() => setStartPicker(true)}>
                                        <Text>{startDate.toLocaleDateString()}</Text>
                                    </Pressable>
                                    {startPicker && (
                                        <DateTimePicker
                                            value={startDate}
                                            mode="date"
                                            display="default"
                                            onChange={onChangeMobileStart}
                                        />
                                    )}
                                </>
                            )
                            }
                            <Text style={styles.textCalendar}>Fecha de fin</Text>
                            {
                                Platform.OS == 'web' ? (
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => {
                                            if (date) setEndDate(date);
                                        }}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                ) : (
                                    <>
                                        <Pressable onPress={() => setEndPicker(true)}>
                                            <Text>{endDate.toLocaleDateString()}</Text>
                                        </Pressable>
                                        {endPicker && (
                                            <DateTimePicker
                                                value={endDate}
                                                mode="date"
                                                display="default"
                                                onChange={onChangeMobileEnd}
                                            />
                                        )}
                                    </>
                                )
                            }
                            <View style={styles.container}>
                                <Pressable style={styles.Pressable} onPress={() => setCalendar2(false)}>
                                    <Text style={styles.textPressable}>Cerrar</Text>
                                </Pressable>
                                <Pressable style={styles.Pressable} onPress={handleConfirm}>
                                    <Text style={styles.textPressable}>Confirmar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            {!isRange ? (
                <ConsumptionBetweenDates startDay={selectedDate} endDay={selectedDate} />
            ) : (
                <ConsumptionBetweenDates startDay={startDate} endDay={endDate} />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    Pressable: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 5,
        borderRadius: 10,
        marginBottom: 20,
        width: '48%'
    },
    textPressable: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.2,
        color: 'white',
        margin: 'auto'
    },
    containerDate: {
        width: '50%'
    },
    textCalendar: {
        margin: 'auto',
        color: 'white',
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#cacaca',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    containerWeb: {
        padding: 50,
    },
})

export default DaysHistory;