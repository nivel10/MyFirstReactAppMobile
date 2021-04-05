import React, {useState, useCallback, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect  } from '@react-navigation/native'

import { getTopRestaurantsAsync } from '../utils/actions';
import Loading from '../components/Loading';
import ListTopRestaurants from '../components/ranking/ListTopRestaurants';

export default function TopRestaurants({ navigation }) {
    const [restaurants, setRestaurants] = useState(null);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function getData () {
                setLoading(true);
                const result = await getTopRestaurantsAsync(10);
                setLoading(false);

                if(result.statusResponse){
                    setRestaurants(result.result);
                }
            }
            getData();

        }, [],)
    )

    return (
        <View>
            <ListTopRestaurants 
                restaurants={restaurants} 
                navigation={navigation} 
            />
            <Loading isVisible={loading} text="Please wait..." />
        </View>
    )
}

const styles = StyleSheet.create({


})