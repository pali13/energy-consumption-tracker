import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type CustomHeaderProps = {
  title: string;
  logo?: any; // Puedes usar 'require' para las imágenes en React Native
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, logo }) => {
  return (
    <View style={styles.container}>
      {logo ? (
        <>
          <Text style={styles.title}>{title}</Text>
          <Image source={logo} style={styles.logo} />
        </>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </View>
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
