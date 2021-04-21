import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { getResponse } from '../utils/helpers';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

export const getNotificationTokenAsyn = async() =>{
    let response = getResponse();
    try{
        if(Constants.isDevice){
            const { status: existingStatus, } =  await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            let notificationToken = null;

            if(existingStatus === "granted"){
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;

                if(finalStatus === "granted"){
                    notificationToken = (await Notifications.getExpoPushTokenAsync()).data;

                    if(Platform.OS === "android"){
                        Notifications.setNotificationChannelAsync(
                            "default", 
                            {
                                name: "default", 
                                importance: Notifications.AndroidImportance.MAX,
                                vibrationPattern:[0, 250, 250, 250],
                                lightColor: "#cccdcf",
                            });
                    }
                    response.result = notificationToken;
                } else {
                    response.isWarning = true;
                    response.msgType = 1;
                    response.msgText = 'You must give permisssion to access the notifications.';
                    Alert.alert('Warining', response.msgText);
                }
            } else {
                response.isWarning = true;
                response.msgType = 1;
                response.msgText = 'You must give permisssion to access the notifications - 02.';
                Alert.alert('Warining', response.msgText);    
            }
        } else {
            response.isWarning = true;
            response.msgType = 1;
            response.msgText = 'You must use a physical device to use the notifications.';
            Alert.alert('Warining', response.msgText);
        }
    } catch(ex){
        response.isSuccess = false;
        response.msgType = -1;
        response.msgText = `${ex.code} - ${ex.message}`;
    }
    return response;
}

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});

export const startNotifications = (notificationListener, responseListener) => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
        console.log(notification);
    })

    return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
    }
}

export const sendPushNotificaionsAsync = async (message) => {
    let response = getResponse();
    try{
        const url = 'https://exp.host/--/api/v2/push/send';
        const options = {
            method: 'post',
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
            body: JSON.stringify(message),
        };
        const result = await fetch(url, options);
        response.result = await result.json();

    } catch(ex){
        response.isSuccess = false;
        response.msgType = -1;
        response.msgText = `${ex.code} - ${ex.message}`;
    }
    return response;
}

export const setNotificationMessage = (token, title, body, data,) => {
    return {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data,
    };
}

/*export const getToken = async() => {
    let response = getResponse();
    try{   
        if (!Constants.isDevice) {
            Alert.alert("Debes utilizar un dispositivo físico para poder utilizar las notificaciones.")
            return
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status 
        }

        if (finalStatus !== "granted") {
            Alert.alert("Debes dar permiso para acceder a las notificaciones.")
            return
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data

        if (Platform.OS == "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C"
            })
        }
        response.result = token;
    } catch(ex){
        response.isSuccess = false;
        response.msgType = -1;
        response.msgText = `${ex.code} - ${ex.message}`;
    }
    return response;
}*/