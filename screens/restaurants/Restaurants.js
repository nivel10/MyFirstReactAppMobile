import React, {useState, useEffect, useCallback, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect, } from '@react-navigation/native';

import firebase from 'firebase/app';

import Loading from '../../components/Loading';
import { getRestaurantsAsync } from '../../utils/actions';

export default function Restaurants({ navigation }) {

    const [user, setUser] = useState(null);
    const [startRestaurant, setStartRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [showLoading, setshowLoading] = useState(false);

    const limitRestaurants = 7;
    console.log("", restaurants);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false);
        });
    }, []);

    useFocusEffect(
        useCallback(async() => {
            setshowLoading(true);
            const response = await getRestaurantsAsync(limitRestaurants);
            if(response.statusResponse){
                setStartRestaurant(response.startRestaurant);
                setRestaurants(response.restaurants);
            }
            setshowLoading(false);
        }, [])
    );

    if(user === null){
        return <Loading
            isVisible={true} 
            text="Loading, please wait..."
        />
    }

    return (
        <View
            style={styles.viewBody}
        >
            <Text>Restaurants...</Text>
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#f2936c"
                        reverse={true}
                        containerStyle={styles.btnIconContainer}
                        onPress={() => navigation.navigate("addRestaurant")}
                    />
                )
            }
            <Loading
                isVisible={showLoading}
                text="Loading restaurants..."
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },

    btnIconContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "gray",
        shadowOffset: {width: 2, height: 2, },
        shadowOpacity: 0.5,
    }
})