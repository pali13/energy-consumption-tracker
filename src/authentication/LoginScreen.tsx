import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { FontAwesome } from '@expo/vector-icons'; // Puedes usar iconos de FontAwesome o cualquier otra librería
import { useAuth } from '../context/AuthContext';
import CustomHeader from '../component/CustomHeader';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const { login } = useAuth();
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = React.useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    const handleLogin = async () => {
        const error = await login(username, password);
        if (error) {
            setErrorMessage(error);
        } else {
            setErrorMessage('');
            navigation.navigate('Home');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <CustomHeader title={'Iniciar Sesión'} />
            <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} />
            <View style={styles.container}>
                <TextInput
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    style={styles.input}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={!isPasswordVisible}
                        style={styles.passwordInput}
                    />
                    <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <FontAwesome name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="gray" />
                    </Pressable>
                </View>
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                <Pressable onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </Pressable>
                <Pressable onPress={handleRegister}>
                    <Text style={styles.registerLink}>¿No tienes una cuenta? Regístrate aquí</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 10,
        margin: 'auto',
        width: '100%',
        borderRadius: 30,
        marginTop: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        margin: 'auto'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5,
        paddingLeft: 8,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    passwordInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    registerLink: {
        alignItems: 'center',
        marginTop: 10,
        color: 'blue',
    },
    logo: {
        width: '70%',
        height: 250,
        marginTop: 30,
        marginBottom: 30,
        marginRight: 'auto',
        marginLeft: 'auto'
    },
});

export default LoginScreen;
