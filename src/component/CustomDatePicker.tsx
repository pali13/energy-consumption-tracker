import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { View, Text, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { es } from 'date-fns/locale';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import '../styles/DatePickerStyles.css'
import { format } from 'date-fns';

registerLocale('es', es);
setDefaultLocale('es');

interface CustomDatePickerProps {
    placeholder: string;
    date: Date | null;
    onDateChange: (date: string | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ placeholder, date, onDateChange }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleDateChange = (date: Date | null) => {
        if (date) {
          const formattedDate = format(date, 'yyyy-MM-dd');
          onDateChange(formattedDate);
        } else {
          onDateChange(null);
        }
        setIsOpen(false);
      };

    const renderCustomHeader = ({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthPressableDisabled,
        nextMonthPressableDisabled,
    }: any) => (
        <View style={styles.headerContainer}>
            <Pressable onPress={decreaseMonth} disabled={prevMonthPressableDisabled}>
                <Text>{"<"}</Text>
            </Pressable>
            <View style={styles.headerSelects}>
                <select
                    value={date.getFullYear()}
                    onChange={({ target: { value } }) => changeYear(parseInt(value))}
                    style={styles.select}
                >
                    {Array.from(new Array(100), (v, k) => k + 1950).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <select
                    value={date.getMonth()}
                    onChange={({ target: { value } }) => changeMonth(parseInt(value))}
                    style={styles.select}
                >
                    {Array.from(new Array(12), (v, k) => k).map((option) => (
                        <option key={option} value={option}>
                            {new Date(0, option).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>
            </View>
            <Pressable onPress={increaseMonth} disabled={nextMonthPressableDisabled}>
                <Text>{">"}</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder+' (YYYY-MM-DD)'}
                value={date ? date.toISOString().split('T')[0] : ''}
                editable={false}
                style={styles.textInput}
            />
            <Pressable onPress={() => setIsOpen(true)} style={styles.iconContainer}>
                <FontAwesome name="calendar" size={24} color="black" />
            </Pressable>
            <Modal visible={isOpen} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.datePickerContainer}>
                        <DatePicker
                            selected={date}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Selecciona una fecha"
                            className="custom-datepicker"
                            renderCustomHeader={renderCustomHeader}
                            locale="es"
                        />
                        <Pressable onPress={() => setIsOpen(false)} style={styles.closePressable}>
                            <Text>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '80%',
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: '#ccc',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    headerSelects: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    select: {
        margin: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    datePickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    closePressable: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    textInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
    },
});

export default CustomDatePicker;
