import React, { useEffect, useState, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input, } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { isEmpty } from 'lodash';

import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import { addDocumentWithOutIdAsync, getCurrentUser, getDocumentByIdAsync, updateDocumentByIdAsync } from '../../utils/actions';

export default function AddReviewRestaurant({ navigation, route, }) {

    const { idRestaurant, name, } = route.params;

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [errorTitle, setErrorTitle] = useState(null);
    const [review, setReview] = useState("");
    const [errorReview, setErrorReview] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const toastRef = useRef();
    const toastRefTimer = 1500;

    const addReviewAsync = async() =>{
        if(!validForm()){
            return;
        }

        setShowLoading(true);
        const user = getCurrentUser();

        const data = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idRestaurant: idRestaurant,
            title: title,
            rating: rating,
            comment: review,
            createAt: new Date(),
        };

        const responseAdd = await addDocumentWithOutIdAsync("reviews", data);
        if(!responseAdd.statusResponse){
            setShowLoading(false);
            toastRef.current.show(responseAdd.error.message, toastRefTimer);
            return;
        }

        const responseGetRestaurant = await getDocumentByIdAsync("restaurants", idRestaurant);
        if(!responseGetRestaurant.statusResponse){
            setShowLoading(false);
            toastRef.current.show(responseGetRestaurant.error.message, toastRefTimer);
            return;
        }

        const restaurant = responseGetRestaurant.document;
        const ratingTotal = restaurant.ratingTotal + rating;
        const quantityVoting = restaurant.quantityVoting + 1;
        const ratingResult = ratingTotal / quantityVoting;
        const restaurantUpdate = {
            ratingTotal: ratingTotal,
            quantityVoting: quantityVoting,
            rating: ratingResult,
        };
        const responseUpdateRestaurante = await updateDocumentByIdAsync("restaurants", idRestaurant, restaurantUpdate)
        setShowLoading(false);
        if(!responseUpdateRestaurante.statusResponse){
            
            toastRef.current.show(responseGetRestaurant.error.message, toastRefTimer);
            return;    
        }
        navigation.goBack();
    }

    const validForm = () =>{
        setErrorTitle(null);
        setErrorReview(null);
        let isValid = true;

        if(!rating){
            toastRef.current.show("You must give a score to the restaurant.", toastRefTimer);
            isValid = false;
        }

        if(isEmpty(title)){
            setErrorTitle("You must enter a title to the comment.");
            isValid = false;
        }

        if(isEmpty(review)){
            setErrorReview("You must enter a comment.");
            isValid = false;
        }

        return isValid;
    }

    return (
        <KeyboardAwareScrollView style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    
                    count={5}
                    reviews={["Bad :/", "Regular :|", "Normal :)", "Good ;)", "Excellent XD",]}
                    defaultRating={0}
                    size={30}
                    onFinishRating={(value) => setRating(value)}
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
            <Toast 
                ref={toastRef}
                position="center"
                opacity={0.9}/>

            <Loading 
                isVisible={showLoading} 
                text="Processing please wait..."/>
        </KeyboardAwareScrollView>
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