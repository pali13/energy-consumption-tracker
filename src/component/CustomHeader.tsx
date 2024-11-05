import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { RootStackParamList } from '../types/types';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type CustomHeaderProps = {
  title: string;
  logo?: any; // Puedes usar 'require' para las imágenes en React Native
  button?: boolean;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, logo, button }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Tipo de navegación

  return (
    <View style={styles.container}>
      {logo && button ? (
        <>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <FontAwesome name={'chevron-circle-left'} size={30} color={"#3b5998"} />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <Image source={logo} style={styles.logo} />
        </>
      ) : button ? (
        <>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <FontAwesome name={'chevron-circle-left'} size={30} color={'#3b5998'} />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <div></div>
        </>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#3b5998',
    borderBottomWidth: 3
  },
  logo: {
    width: 50,
    height: 50,
    aspectRatio: 1, // Esto asegura que la imagen mantenga sus proporciones
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
