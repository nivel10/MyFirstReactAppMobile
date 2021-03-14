import React, {useCallback, useState, useRef, } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Icon, ListItem, Rating, } from 'react-native-elements';
import { useFocusEffect, } from '@react-navigation/native'
import { map } from 'lodash';

import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import CarouselImages from '../../components/restaurants/CarouselImages';
import ListReviews from '../../components/restaurants/ListReviews';
import MapRestaurant from '../../components/restaurants/MapRestaurant';

import { getDocumentByIdAsync } from '../../utils/actions';
import { formatPhone } from '../../utils/helpers';

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route, }) {

    const {id, name, } = route.params;
    const toastTimeShow = 1500;
    const toastRef = useRef();
    const [restaurant, setRestaurant] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useFocusEffect(
        useCallback(() => {
            (async() =>{
                const response = await getDocumentByIdAsync("restaurants", id);
                if(response.statusResponse){
                    setRestaurant(response.document);
                } else {
                    setRestaurant({});
                    toastRef.current.show(response.error.message, toastTimeShow);
                }
            })()
            navigation.setOptions({ title: name, });
        }, [])
    );

    if(!restaurant){
        return ( 
            <Loading 
                isVisible={true} 
                text="Loading please wait..." 
            />
        )
    }

    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages 
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <RestaurantTitle 
                name={restaurant.name} 
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formatPhone(restaurant.callingCode, restaurant.phone)}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
                name={restaurant.name}/>
            <Toast
                ref={toastRef} 
                position="center"
                opacity={0.9} 
            />
        </ScrollView>
    )
}

function RestaurantTitle({name, description, rating, }){
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={styles.viewRestaurantContainer}>
                <Text style={styles.restaunatName}>{name}</Text>
                <Rating 
                    imageSize={12}
                    readOnly={true}
                    startingValue={parseFloat(rating)}
                    style={styles.rating}/>
            </View>
            <Text style={styles.restaunatDescription}>{description}</Text>
        </View>
    );
}

function RestaurantInfo({ name, location, address, email, phone, }){
    const listInfo = [
        { text: address, iconName: "map-marker", },
        { text: phone, iconName: "phone", },
        { text: email, iconName: "email", },
    ];
    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Restaurant information:</Text>
            <MapRestaurant 
                location={location}
                name={name}
                height={150}/>
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon 
                            type="material-community"
                            name={item.iconName}
                            color="#f2936c"
                        />
                        <ListItem.Content>
                            <ListItem.Title style={{color: "#7c7c82"}}>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        backgroundColor: "#ffff",
        flex: 1,
    },

    viewRestaurantTitle: {
        padding: 15,
    },

    viewRestaurantContainer: {
        flexDirection: "row",
    },

    restaunatName: {
        fontWeight: "bold",
        color: "#3c3c3c",
    },

    rating: {
        backgroundColor: "transparent",
        position: "absolute",
        right: 0,
    },

    restaunatDescription: {
        marginTop: 10,
        color: "#7c7c82",
        textAlign: "justify",
    },

    viewRestaurantInfo: {
        margin: 10,
    },

    restaurantInfoTitle: {
        color: "#3c3c3c",
        fontWeight: "bold",
        marginBottom: 10,
        textDecorationLine: "underline",
    },

    containerListItem: {
        borderBottomColor: "#917464",
        borderBottomWidth: 0.4,
    },
})