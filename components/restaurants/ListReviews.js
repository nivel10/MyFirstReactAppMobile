import React, { useState, useCallback, } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Icon, Rating } from 'react-native-elements';
import { useFocusEffect, } from '@react-navigation/native'

import { size, map } from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getRestaurantReviewsAsync } from '../../utils/actions';

import firebaseApp from 'firebase/app';
import moment from 'moment/min/moment-with-locales';

moment.locale("en");

export default function ListReviews({ navigation, idRestaurant, name, }) {

    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);

    firebaseApp.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getRestaurantReviewsAsync(idRestaurant);
                if(response.statusResponse){
                    setReviews(response.reviews);
                } else {
                    console.log(response.error.message)
                }
            })()
        }, [])
    );

    return (
        <View>
           {
               userLogged ? (
                <Button
                    buttonStyle={styles.btnAddReview}
                    title="Write an opinion."
                    titleStyle={styles.btnTtleAddReview}
                    icon={{
                        type: "material-community", 
                        name: "square-edit-outline", 
                        color: "#f2936c", 
                    }}
                    onPress={() => navigation.navigate("addReviewRestaurant", {idRestaurant, name, })}
                />
               ) : (
                <Text 
                    style={styles.mustLoginText}
                    onPress={() => navigation.navigate("login")}
                    >
                    To write an opinion you must be logged in.{"\n "}
                    {/* <TouchableOpacity style={styles.itemsTouchableOpacity}>
                        <Icon 
                            type="material-community"
                            name="account-circle"
                            color="#3c3c3c"
                        /> */}
                        <Text style={styles.loginText}>
                            Click here to login.
                        </Text>
                    {/* </TouchableOpacity> */}
                </Text>
                )
           }
           <View>
           {
               size(reviews) > 0 && (
                    map(reviews, (review, index) => (
                        <Reviews
                            key={index}
                            review={review}
                        />
                    ))
               ) 
           }
           </View>
        </View>
    )
}

function Reviews({review}){
    const {title, comment, createAt, avatarUser, rating, }  = review;
    const createReview = new Date(createAt.seconds * 1000);
    return (
        <View style={styles.viewReview}>
            <View style={styles.imageAvatar}>
                <Avatar 
                    renderPlaceholderContent={<ActivityIndicator color="#ffff"/>}
                    size="large"
                    rounded={true}
                    containerStyle={styles.imageAvatarUser}
                    source={avatarUser ? {uri: avatarUser} : require("../../assets/avatar-default.png")}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{comment}</Text>
                <Rating 
                    imageSize={15}
                    startingValue={rating}
                    readOnly={true}
                />
                <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",
    },

    btnTtleAddReview: {
        color: "#f2936c",
    },

    itemsTouchableOpacity: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    mustLoginText: {
        textAlign: "center",
        color: "#3c3c3c",
        padding: 20, 
    },

    loginText: {
        color: "#3c3c3c",
        fontWeight: "bold",
    },

    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 10,
        borderBottomColor: "#917464",
        borderBottomWidth: 1,
    },

    imageAvatar: {
        marginRight: 15,
    },

    imageAvatarUser: {
        height: 50,
        width: 50,
    },

    viewInfo: {
        flex: 1,
        alignItems: "flex-start",
    },

    reviewTitle:{
        fontWeight: "bold",
    },

    reviewText: {
        paddingTop: 2,
        color: "#3c3c3c",
        marginTop: 5,
    },

    reviewDate: {
        marginTop: 5,
        color: "#3c3c3c",
        fontSize: 11,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
})