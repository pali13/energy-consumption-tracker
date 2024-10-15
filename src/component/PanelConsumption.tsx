import { Appliance } from '../class/appliance';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PanelConsumptionProps {
  appliances: Appliance[];
}

const PanelConsumption: React.FC<PanelConsumptionProps> = ({ appliances }) => {
  const getTotalConsumption = () => {
    return appliances.reduce((total, appliance) => total + appliance.getCurrentConsumption(), 0);
  };

  return (
    <View style={styles.container}>
      <Text>Total Consumption: {getTotalConsumption().toFixed(2)} Wh</Text>
      <Text>Precio: $ {(getTotalConsumption()/1000 * 3.75).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
});

export default PanelConsumption;
