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
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        };

        response.status = true;
        response.location = location;
    } catch (ex) {
        response.error = ex;
    }
    return response;
}

export const reverseGeocodeAsync = async(geoLocation) =>
{
    const result = {status: false, address: null, error: null, };
    try {
        const positionAddress = await Location.reverseGeocodeAsync(geoLocation);
        const address = {
            country: positionAddress[0].country,
            city: positionAddress[0].city,
            subregion: positionAddress[0].subregion,
            street: positionAddress[0].subregion,
            region: positionAddress[0].region,
            district: positionAddress[0].district,
            timezone: positionAddress[0].timezone,
            name: positionAddress[0].name,
            postalCode: positionAddress[0].postalCode,
            isoCountryCode: positionAddress[0].isoCountryCode,
            getFullAddress: positionAddress[0].name + ', ' + positionAddress[0].street + '. ' + positionAddress[0].district + ' - ' + positionAddress[0].city + ' (' + positionAddress[0].postalCode + ').',
        };
        
        result.status = true;
        result.address = address;
    } catch (ex) {
        result.error = ex;
    }
    return result;
}