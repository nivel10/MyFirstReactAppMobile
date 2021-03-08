import React, {useState, } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View, } from 'react-native'
import { Avatar, Button, Icon, Image, Input, } from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import { map, size, filter, } from 'lodash';

import { loadImageFromGalleryAsync } from '../../utils/helpers';
import Modal from '../../components/Modal';
import { color } from 'react-native-reanimated';

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm({ toastRef, setShowLoading, navigation, }) {
    const [formData, setFormData] = useState(defaultFormValues());
    const [errorName, setErrorName] = useState(null);
    const [errorDescription, setErrorDescription] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPhone, setErrorPhone] = useState(null);
    const [errorAddress, setErrorAddress] = useState(null);
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        console.log(formData)
        console.log("Ok");
    }

    return (
        <ScrollView 
            style={styles.viewContainer}
        >
            <ImageRestaurat 
                imageRestaurant={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorPhone={errorPhone}
                errorAddress={errorAddress}
                setIsVisibleMap={setIsVisibleMap}
            />

            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />

            <Button
                title="Save"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

const defaultFormValues = () =>{
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "VE",
        callingCode: "58",
    };
}

function FormAdd({ formData, setFormData, errorName, errorDescription, errorEmail, errorPhone, errorAddress, setIsVisibleMap, }){
    const [country, setCountry] = useState("VE");
    const [callingCode, setCallingCode] = useState("58");
    const [phone, setPhone] = useState("");

    const onChange = (e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text, });
    }

    return (
        <View
            style={styles.viewForm}
        >
            <Input
                placeholder="Restaurant name"
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
                rightIcon={{
                    type: "material-community",
                    name: "card-account-details-outline",
                    color: "#c2c2c2",
                }}
            />

            <Input
                placeholder="Restaurant address"
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress:() => setIsVisibleMap(true),
                }}
            />

            <Input
                keyboardType="email-address"
                placeholder="Restaurant email"
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
                rightIcon={{
                    type: "material-community",
                    name: "email",
                    color: "#c2c2c2",
                }}
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
                        setFormData({...formData, "country": country.cca2, "callingCode": country.callingCode[0],})
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0]) 
                    }}
                />
                
                <Input
                    placeholder="Restaurant whastApp"
                    keyboardType="phone-pad"
                    defaultValue={formData.phone}
                    containerStyle={styles.inputPhone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                    rightIcon={{
                        type: "material-community",
                        name: "cellphone",
                        color: "#c2c2c2"
                    }}
                />

            </View>

            <Input
                    placeholder="Restaurante description"
                    multiline={true}
                    containerStyle={styles.inputTextArea}
                    onChange={(e) => onChange(e, "description")}
                    defaultValue={formData.description}
                    errorMessage={errorDescription}
                    rightIcon={{
                        type: "material-community",
                        name: "text-box-plus-outline",
                        color: "#c2c2c2"
                    }}
                />
        </View>
    );
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected, }){

    const imageSelect = async () => {
        const response = await loadImageFromGalleryAsync([4, 3]);

        if(!response.status){
            toastRef.current.show("You have not selected any image.", 1500);
        }

        setImagesSelected([...imagesSelected, response.image, ]);
    }

    const removeImage = (image) => {
        Alert.alert(
            "Warning", 
            "Are you sure to delete this. This process is irreversible. Do you want to continue?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    )
                }
            ],
            {
                cancelable: true,
            }
        );
    }

    return (
        <ScrollView
            horizontal={true}
            style={styles.viewImage}
        >
            {
                size(imagesSelected) < 10 &&
                (
                    <Icon 
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.iconContainer}
                        onPress={imageSelect}
                    />   
                )
            }

            {
                map(imagesSelected, (imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{uri: imageRestaurant, }}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))
            }

        </ScrollView>
    );
}

function ImageRestaurat({ imageRestaurant, }){
    return (
        <View
            style={
                { 
                    height:200, 
                    width: widthScreen, 
                    bottom: 20, 
                }
            }
        >
            <Image
                style={styles.viewPicture}
                source={
                    imageRestaurant ?
                        {uri: imageRestaurant}
                        : require("../../assets/NoImage.png")
                }
            />
        </View>
    );
}

function MapRestaurant({isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef, }){
    return (
        <Modal
            isVisible={isVisibleMap}
            setVisible={setIsVisibleMap}
        >
            <Text>Map goes here...!!!</Text>
        </Modal>
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
        width: "100%",
    },

    inputTextArea: {
        height: 100,
        width: "100%",
    },

    viewImage: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 30,
    },

    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },

    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },

    viewPicture: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
})