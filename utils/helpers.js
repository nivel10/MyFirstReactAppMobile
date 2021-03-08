import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGalleryAsync = async (array) => {
    const response = {status: false, image: null};
    const resultPemissions = await Permissions.askAsync(Permissions.CAMERA);

    if(resultPemissions.status === "denied")
    {
        Alert.alert("Information", "Your must give it permission to access the device images.");
        return response;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array,
    });

    if(result.cancelled){
        return response;
    }

    response.status = true;
    response.image = result.uri;

    return response;
}

export const fileToBlobAsync = async (path) => {
    const fileFullPat = await fetch(path);
    const blob = await fileFullPat.blob();
    return blob;
}

export const getCurrentLocationAsync = async () => {
    const response = {status: false, location: null, error: null, };
    try {
        const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);

        if(!resultPermissions.status == "denied"){
            Alert.alert("Warning", "You must give permission for the location.");
            return response;
        }

        const position = await Location.getCurrentPositionAsync({});
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudDelta: 0.001,
            longitudDelta: 0.001,
        }

        response.status = true;
        response.location = location;
    } catch (ex) {
        response.error = ex;
    }
    return response;
}