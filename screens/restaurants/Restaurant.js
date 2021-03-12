import React, {useState, useEffect, useRef, } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast';
import { Rating, } from 'react-native-elements';

import Loading from '../../components/Loading';
import CarouselImages from '../../components/restaurants/CarouselImages';
import { getDocumentByIdAsync } from '../../utils/actions';

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route, }) {

    const {id, name, } = route.params;
    //navigation.setOptions({ title: name, });
    const toastTimeShow = 1500;
    const toastRef = useRef();
    const [restaurant, setRestaurant] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
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
})