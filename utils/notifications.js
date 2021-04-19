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

            if(existingStatus !== "granted"){
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