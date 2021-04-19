import React, { useState, useEffect, } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, } from 'react-native'
import { SearchBar, ListItem, Icon, Image, } from 'react-native-elements';

import { isEmpty, size } from 'lodash';
import { searchRestaurantsAsync } from '../utils/actions';

export default function Search({ navigation }) {
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [showLoading, setshowLoading] = useState(false);

    useEffect(() => {
        if(isEmpty(search)){
            return;
        }
        async function getData() {
            setshowLoading(true)
            const result = await searchRestaurantsAsync(search);
            if(result.statusResponse){
                setRestaurants(result.result);
            } else {

            }
            setshowLoading(false)
        }
        getData();
    }, [search]);

    const clearSearch = () =>{
        setSearch("");
        setRestaurants([]);
    }

    return (
        <View>
            <SearchBar
                placeholder="Enter restaurante name"
                onChangeText={(e) => setSearch(e)}
                onClear={() => clearSearch()}
                onCancel={() => clearSearch()}
                containerStyle={styles.searchBar}
                showLoading={showLoading}
                value={search}
            />
            {
                size(restaurants) > 0 ? (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(restaurant) => 
                            <Restaurant
                                restaurant={restaurant}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.notFound}>Enter the first letters of the restaurant.</Text>
                    ) : (
                        <Text style={styles.notFound}>There are no restaurants that match the search criteria.</Text>
                    )
                )
            }
        </View>
    )
}

function Restaurant({ restaurant, navigation, }){
    const { id, name, images, } = restaurant.item;

    return (
        <ListItem 
            style={styles.menuItem}
            onPress={() => navigation.navigate("restaurants", {
                screen: "restaurant",
                params: { id, name }
            })}
        >    
            <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#ffff" />}
                source={{uri: images[0]}}
                style={styles.imageRestaurant}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
        backgroundColor: "#ffff",
    },
    imageRestaurant: {
        width: 90,
        height: 90,
    },
    notFound: {
        alignSelf: "center",
        width: "90%",
    },
    menuItem: {
        margin: 10,
    },
})