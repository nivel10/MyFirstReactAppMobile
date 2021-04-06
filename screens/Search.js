import React, { useState, useEffect, } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { isEmpty } from 'lodash';
import { searchRestaurantsAsync } from '../utils/actions';

export default function Search({ navigation }) {
    const [search, setSearch] = useState("Fi");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if(isEmpty(search)){
            return;
        }
        async function getData() {
            const result = await searchRestaurantsAsync(search);
            if(result.statusResponse){
                setRestaurants(result.result);
            }
        }
        getData();
    }, [search]);
    console.clear();
    console.log(search);
    console.log(restaurants);

    return (
        <View>
            <Text>Searh</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
