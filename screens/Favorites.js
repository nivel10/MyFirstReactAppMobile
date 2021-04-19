import React, { useState, useCallback, useRef, } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, } from 'react-native'
import { Button, Icon, Image, } from 'react-native-elements';

import Toast from 'react-native-easy-toast';

import { useFocusEffect } from '@react-navigation/native'
import { getFavoritesAsync, isUserLogged, removeIsFavoriteAsync } from '../utils/actions';

import Loading from '../components/Loading';

export default function Favorites({ navigation, }) {
    const toastRef = useRef();
    const [restaurants, setRestaurants] = useState(null);
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

    if(!userLogged){
        return <UserNoLogged navigation={navigation} />
    } else {
        if(!restaurants){
            return <Loading isVisible={loading} text="Loading restaurants, please wait..."  />
        } else if(restaurants?.length === 0 ){
            return <NotFoundRestaurants />
        }
    }

    return (
        <View style={styles.viewBody}>
            {
                restaurants.length > 0 ? (
                    <FlatList
                    keyExtractor={(item, index) => index.toString()}
                        data={restaurants}
                        renderItem={(restaurant)=> (
                            <Restaurant
                                restaurant={restaurant}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setreloadData={setreloadData}
                            />
                        )}
                    />
                ) : (
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size="large"/>
                        <Text style={{textAlign: 'center'}}>
                            Loading restaurants...
                        </Text>
                    </View>
                )
            }
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

function Restaurant({restaurant, setLoading, toastRef, navigation, setreloadData, }) {
    const {id, name, images } = restaurant.item;

    const removeFavoriteAsync = async () => {
        try {
            setLoading(true);
            const result = await removeIsFavoriteAsync(id);
            setLoading(false);

            if(result.statusResponse){
                setreloadData(true);
                toastRef.current.show('Restaurant deletes from faorites', 1500);
            } else {
                Alert.alert('Error', `Method: removeFavoriteAsync </br>${ex.result.message}`);    
            }
        } catch (ex) {
            Alert.alert('Error', `Method: removeFavoriteAsync </br>${ex.message}`);
        }
    }

    const confirmRemoveFavorites =() => {
        Alert.alert(
            'Warning', 
            'Are you sure you want to delete the restaurant from favorites?', 
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: removeFavoriteAsync,
                },
            ],
            { cancelable: false, }
        );
    }

    return(
        <View style={styles.restaurant}>
            <TouchableOpacity 
                onPress={()=> navigation.navigate(
                    "restaurants", 
                    {screen: "restaurant", params: {id, name}}
                )}>
            <Image 
                resizeMode="cover"
                style={styles.image}
                PlaceholderContent={<ActivityIndicator color="#ffff"/>}
                source={{uri: images[0]}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Icon 
                    type="material-community" 
                    name="heart" 
                    color="#f2936c" 
                    containerStyle={styles.favorite}
                    underlayColor="transparent"
                    onPress={() => confirmRemoveFavorites()}
                />
            </View>
            </TouchableOpacity>
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

    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },

    loaderRestaurant: {
        marginVertical: 10,
    },

    restaurant: {
        margin: 10,
    },

    image: {
        width: "100%",
        height: 180,
    },

    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor: "#ffff",
    },

    name: {
        fontWeight: "bold",
        fontSize: 20,
        color: "grey",
    },

    favorite: {
        marginTop: -30,
        backgroundColor: "#ffff",
        padding: 15,
        borderRadius: 100,
    }
})