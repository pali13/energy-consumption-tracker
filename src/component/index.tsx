import React, { useEffect, useState } from 'react';
import { View, Text, Switch, FlatList, StyleSheet } from 'react-native';
import { Appliance } from '../class/appliance';
import CurrentTime from './currentTime';
import PanelConsumption from './panelConsumption';


const ApplianceList = () => {

  return (
    <>
      <CurrentTime />
      <PanelConsumption appliances={appliances}/>
      <FlatList
        data={appliances}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Switch
              value={item.isOn}
              onValueChange={() => toggleSwitch(item.id)}
            />
            <Text>{item.getCurrentConsumption().toFixed(2)} Wh</Text>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ApplianceList;