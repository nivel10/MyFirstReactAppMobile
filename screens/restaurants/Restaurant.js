import React, {useState, useEffect, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import { getDocumentByIdAsync } from '../../utils/actions';

export default function Restaurant({ navigation, route, }) {

    const {id, name, } = route.params;
    const toastRefTimer = 1500;
    navigation.setOptions({ title: name, });

    const [restaurant, setRestaurant] = useState(null);
    const [showLoading, setshowLoading] = useState(false);
    const toastRef = useRef();

    useEffect(() => {
        (async() =>{
            setshowLoading(true);
            const response = await getDocumentByIdAsync("restaurants", id);
            setshowLoading(false);
            if(response.statusResponse){
                setRestaurant(response.document);
            } else {
                setRestaurant({});
                toastRef.current.show(response.error.message, toastRefTimer);
            }
        })()
    }, [])

    return (
        <View>
            <Text>{id}</Text>
            {
                restaurant &&  (<Text>{restaurant.description}</Text>)
            }
            
            
        </View>
    )
}

const styles = StyleSheet.create({})