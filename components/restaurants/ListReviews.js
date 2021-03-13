import React, { useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements';

import firebaseApp from 'firebase/app';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function ListReviews({ navigation, idRestaurant, }) {

    const [userLogged, setUserLogged] = useState(false);

    firebaseApp.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

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
                />
               ) : (
                <Text 
                    style={styles.mustLoginText}
                    onPress={() => navigation.navigate("login")}
                    >
                    To write an opinion you must be logged in.{"\n "}
                    <TouchableOpacity style={styles.itemsTouchableOpacity}>
                        <Icon 
                            type="material-community"
                            name="account-circle"
                            color="#3c3c3c"
                        />
                        <Text style={styles.loginText}>
                            Click here to login.
                        </Text>
                    </TouchableOpacity>
                </Text>
                )
           }
        </View>
    )
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
})