import React, { useEffect, useState, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input, } from 'react-native-elements';

import Toast from 'react-native-easy-toast';

export default function AddReviewRestaurant({ navigation, route, }) {

    const { idRestaura, name, } = route.params;

    const [corating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [errorTitle, setErrorTitle] = useState(null);
    const [review, setReview] = useState("");
    const [errorReview, setErrorReview] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const toastRef = useRef();

    const addReviewAsync = () =>{
        console.log(review);
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    
                    count={5}
                    reviews={["Bad :/", "Regular :|", "Normal :)", "Good ;)", "Excellent XD",]}
                    defaultRating={0}
                    size={30}
                />
            </View>
            <View style={styles.formReview}>
                <Input 
                    containerStyle={styles.inputReview}
                    errorMessage={errorTitle}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                    placeholder="Enter review title..."
                />
                <Input 
                    containerStyle={styles.inputReview}
                    multiline={true}
                    errorMessage={errorReview}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                    placeholder="Enter review..."
                    style={styles.inputArea}
                />
                <View style={styles.btnContainerStyle}>
                    <Button
                        buttonStyle={styles.btnSaveStyle}
                        containerStyle={styles.btnSaveContainer}
                        onPress={addReviewAsync}
                        icon={{
                            type: "material-community",
                            name: "content-save",
                            color: "#767474",
                        }}
                    />
                    <Button
                        buttonStyle={styles.btnCancelStyle}
                        containerStyle={styles.btnSaveContainer}
                        onPress={() => navigation.goBack()}
                        icon={{
                            type: "material-community",
                            name: "close-circle",
                            color: "#767474",
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },

    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2",
    },

    formReview:{
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 30,
    },

    inputReview: {
        marginBottom: 10,
    },

    inputArea: {
        height: 150, 
        width: "100%",
        padding: 0,
        margin: 0,
    },

    btnContainerStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    btnSaveStyle: {
        backgroundColor: "#f2936c",
        borderRadius: 5,
    },

    btnCancelStyle: {
        backgroundColor: "#cccdcf",
        borderRadius: 5,
    },

    btnSaveContainer: {
        alignSelf: "center",
        paddingRight: 5,
        width: "25%",
    },
})