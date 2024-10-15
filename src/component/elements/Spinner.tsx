import React from 'react';
import '../../styles/Spinner.css'; // Asegúrate de importar el archivo CSS
import { StyleSheet, Text, View } from 'react-native';

interface SpinnerProps {
    message: string;
    delay?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    return (
        <View style={styles.spinnerContainer}>
            <View style={styles.spinner} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    spinner: {
        borderWidth: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 50,
        borderTopWidth: 4,
        borderTopColor: '#3498db',
        width: 40,
        height: 40,
        marginBottom: 10,
        // Aquí va la animación si la necesitas
    },
    message: {
        fontSize: 16,
        color: '#333',
        margin: 0,
    },
});

export default Spinner;