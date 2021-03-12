import React, {useState, useEffect, useRef, } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import CarouselImages from '../../components/restaurants/CarouselImages';
import { getDocumentByIdAsync } from '../../utils/actions';

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route, }) {

    const {id, name, } = route.params;
    navigation.setOptions({ title: name, });

    const toastTimeShow = 1500;
    const toastRef = useRef();
    const [restaurant, setRestaurant] = useState(null);

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
            />
            <Text>{restaurant.description}</Text>
            <Toast
                ref={toastRef} 
                position="center"
                opacity={0.9} 
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
})