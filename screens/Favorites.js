import React, { useState, useCallback, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, } from 'react-native-elements';

import Toast from 'react-native-easy-toast';

import { useFocusEffect } from '@react-navigation/native'
import { getFavoritesAsync, isUserLogged } from '../utils/actions';

import Loading from '../components/Loading';

export default function Favorites({ navigation, }) {
    const toastRef = useRef();
    const [restaurants, setRestaurants] = useState([]);
    const [userLogged, setuserLogged] = useState(isUserLogged());
    const [loading, setLoading] = useState(false);
    const [reloadData, setreloadData] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(userLogged){
                async function getData(){
                    setLoading(true);
                    const result = await getFavoritesAsync();
                    setLoading(false);
                    if(result.statusResponse){
                        setRestaurants(result.result);
                    } else {
                       console.log(result);
                    }
                 }
                 getData();
             }
             setreloadData(false);

            }, [userLogged, reloadData],)
    );
    
    console.log(isUserLogged());

    if(!userLogged){
        return <UserNoLogged navigation={navigation} />
    }

    if(!restaurants){
        return <Loading isVisible={loading} text="Loading restaurants, please wait..."  />
    } else if(restaurants?.length === 0 ){
        return <NotFoundRestaurants />
    }

    return (
        <View>
            <Text>Favorites</Text>
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={loading} text="Please wait..." />
        </View>
    )
}

function UserNoLogged({ navigation }) {
    return (
        <View style={styles.userLogged}>
            <Icon type="material-community" name="alert-outline" size={50} color="grey"/>
            <Text style={styles.notFoundRestaurantsTitle}>
                You must be logged in to see the favorites.
            </Text>
            <Button 
                title="Got to login"
                containerStyle={{marginTop: 20, width: "80%", }}
                buttonStyle={{ backgroundColor: "#f2936c", }}
                onPress={() => navigation.navigate("account", {screen: "Login", })}
            />
        </View>
    );
}

function NotFoundRestaurants() {
    return (
        <View style={styles.notFoundRestaurants}>
            <Icon type="material-community" name="alert-outline" size={50} color="grey"/>
            <Text style={styles.notFoundRestaurantsTitle}>
                You don't have favorites restaurants yet.
            </Text>
        </View>
        );
}

const styles = StyleSheet.create({

    userLogged: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    notFoundRestaurants: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    notFoundRestaurantsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "grey"
    },
})