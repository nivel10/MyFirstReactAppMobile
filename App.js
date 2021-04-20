import React, { useEffect, useRef, } from 'react';
import { LogBox } from 'react-native';

import Navigation from './navigations/Navigation';
import { startNotifications } from './utils/notifications';

LogBox.ignoreAllLogs();

export default function App() {

  const notificationListener = useRef();
  const responseListener = useRef();
  
  useEffect(() => {
    startNotifications(notificationListener, responseListener);
  }, [])

  return (
    <Navigation/>
  );
}