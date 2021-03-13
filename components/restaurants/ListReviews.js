import React, { useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements';

import firebaseApp from 'firebase/app';


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
                    To write an opinion you must be logged in.{" "}
                    <Text style={styles.loginText}>
                        Click here to login.
                    </Text>
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

    mustLoginText: {
        textAlign: "center",
        color: "#3c3c3c",
        padding: 20, 
    },

    loginText: {
        fontWeight: "bold",
    },
})