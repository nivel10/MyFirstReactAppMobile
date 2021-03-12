import React, {useState, useEffect, useCallback, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect, } from '@react-navigation/native';
import { size } from 'lodash';
import Toast from 'react-native-easy-toast';

import firebase from 'firebase/app';

import Loading from '../../components/Loading';
import { getMoreRestaurantsAsync, getRestaurantsAsync } from '../../utils/actions';
import ListRestaurants from '../../components/restaurants/ListRestaurants';

export default function Restaurants({ navigation }) {

    const toastTimeShow = 1500;
    const toastRef = useRef();
    const [user, setUser] = useState(null);
    const [startRestaurant, setStartRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [showLoading, setshowLoading] = useState(false);

    const limitRestaurants = 7;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            async function localGetRestaurantsAsync(){
                setshowLoading(true);
                const response = await getRestaurantsAsync(limitRestaurants);
                setshowLoading(false);
                if(response.statusResponse){
                    setStartRestaurant(response.startRestaurant);
                    setRestaurants(response.restaurants);
                }
                else{
                    toastRef.current.show(response.error.message, toastTimeShow);
                }
            }
            localGetRestaurantsAsync();
        }, [])
    );

    const handleLoadMoreAsync = async() =>{
        if(!startRestaurant){
            return;
        }

        setshowLoading(true);
        const response = await getMoreRestaurantsAsync(limitRestaurants, startRestaurant);
        setshowLoading(false);
        if(response.statusResponse){
            setStartRestaurant(response.startRestaurant);
            setRestaurants([...restaurants, ...response.restaurants]);
        } else {
            toastRef.current.show(response.error.message, toastTimeShow);
        }
    }

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
            {
                size(restaurants) > 0 ? (
                    <ListRestaurants 
                        restaurants={restaurants} 
                        navigation={navigation} 
                        handleLoadMore={handleLoadMoreAsync}
                        />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>They are no registered restaurants yet...</Text>
                    </View>
                ) 
            }
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
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
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
    },

    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    notFoundText: {
        fontSize: 16,
        fontWeight: "bold",
    },
})