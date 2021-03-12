import { size } from 'lodash';
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon, Image } from 'react-native-elements';

export default function ListRestaurants({ restaurants, navigation, handleLoadMore, }) {
    return (
        <View>
            <FlatList
                data={restaurants}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(restaurant) => (
                    <Restaurant 
                        restaurant={restaurant} 
                        navigation={navigation} 
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
            />
        </View>
    )
}

function Restaurant({ restaurant, navigation, }){
    const {id, images, name, address, description, phone, callingCode, } = restaurant.item;
    const imageRestaurant = images[0];

    return (
        <TouchableOpacity>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#ffff"/>}
                        source={{uri: imageRestaurant}}
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantTitle}>{name}</Text>
                    <Text style={styles.restaurantInformation}>
                        {
                            size(address) > 0 ? `${address.substr(0, 40)}...` : address
                        }
                        </Text>
                    <Text style={styles.restaurantInformation}>+({callingCode}) {phone}</Text>
                    <Text style={styles.restaurantDescription}>
                        {
                            size(description) > 0 ? `${description.substr(0, 60)}...` : description
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    viewRestaurant: {
        flexDirection: "row",
        margin: 10,
    },

    viewRestaurantImage: {
        marginRight: 15,
    },

    imageRestaurant: {
        width: 90,
        height: 90,
    },

    restaurantTitle: {
        fontWeight:"bold",
    },

    restaurantInformation: {
        paddingTop: 2,
        color: "grey",
    },

    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%",
    },
})