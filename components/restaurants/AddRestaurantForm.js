import React, {useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements';

import CountryPicker from 'react-native-country-picker-modal';

export default function AddRestaurantForm({ toastRef, setShowLoading, navigation, }) {

    const addRestaurant = () => {
        console.log("Ok");
    }

    return (
        <View 
            style={styles.viewContainer}
        >
            <FormAdd />

            <Button
                title="Save"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
        </View>
    )
}

function FormAdd(){
    const [country, setCountry] = useState("VE");
    const [callingCode, setCallingCode] = useState("58");
    const [phone, setPhone] = useState("");

    return (
        <View
            style={styles.viewForm}
        >
            <Input
                placeholder="Restaurant name"
            />

            <Input
                placeholder="Restaurant address"
            />

            <Input
                keyboardType="email-address"
                placeholder="Restaurant email"
            />

            <View
                style={styles.phoneView}
            >
                <CountryPicker
                    withFlag={true}
                    withCallingCode={true}
                    withFilter={true}
                    withCallingCodeButton={true}
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) =>{
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0]) 
                    }}
                />
                
                <Input
                    placeholder="Restaurant whastApp"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                />

            </View>

            <Input
                    placeholder="Restaurante description"
                    multiline={true}
                    containerStyle={styles.inputTextArea}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        top: 10,
        height: "100%",
    },

    btnAddRestaurant: {
        margin: 30,
        backgroundColor: "#f2936c",
    },

    viewForm: {
        marginHorizontal: 10,
    },

    phoneView: {
        width: "80%",
        flexDirection: 'row',
    },

    inputPhone: {
        width: "80%",
    },

    inputTextArea: {
        height: 100,
        width: "100%",
    },

})