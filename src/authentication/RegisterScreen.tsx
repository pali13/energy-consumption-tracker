import React, { useState } from 'react';
import { View, TextInput, Pressable, Image, StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { RootStackParamList } from '../types/types';
import axios from 'axios';
import CustomHeader from '../component/CustomHeader';
import { FontAwesome } from '@expo/vector-icons';
import CustomDatePicker from '../component/CustomDatePicker';
import { parse } from 'date-fns';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const handleRegister = async () => {
    try {
      const response = await api.post('/api/auth/signup', {
        username,
        email,
        password,
        birthDate,
      });
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error al registrar usuario:', error.response.data);
      } else {
        console.error('Error al registrar usuario:', error);
      }
    }
  };

  const formattedDate = birthDate ? parse(birthDate, 'yyyy-MM-dd', new Date()) : null;

  return (
    <View>
      <CustomHeader title={'Registro de Usuario'} />
      <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={{
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            width: '80%',
          }}
        />
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            width: '80%',
          }}
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
        <CustomDatePicker
          placeholder="Fecha de nacimiento"
          date={formattedDate}
          onDateChange={setBirthDate}
        />
        <Pressable onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.buttonText}>Registrar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    margin: 'auto',
    width: '75%',
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  logo: {
    width: '60%',
    height: 200,
    marginTop: 30,
    marginBottom: 30,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  passwordContainer: {
    width: '80%',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  dateText: {
    color: '#000',
  },
})

export default RegisterScreen;
