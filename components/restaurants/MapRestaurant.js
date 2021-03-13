import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps';

export default function MapRestaurant({ location, name, height, }) {

    const localOpenMap = () =>{
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 20,
            query: name,
        });
    }

    return (
        <MapView 
            style={{
                height: height,
                width: "100%",
            }}
            initialRegion={location}
            onPress={localOpenMap}>
                <MapView.Marker coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}>

                </MapView.Marker>
        </MapView>
    )
}

const styles = StyleSheet.create({
    
})