import React from 'react';
/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';*/
import { LogBox } from 'react-native';

import Navigation from './navigations/Navigation';

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <Navigation/>

    /*<View style={styles.container}>
      <Text>Hello world...!!!</Text>
      <StatusBar style="auto" />
    </View>*/
  );
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/