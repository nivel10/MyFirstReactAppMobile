import React, { useState, useEffect, } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, } from 'react-native'
import { Card, Image, Icon, Rating, } from 'react-native-elements';

export default function ListTopRestaurants({ restaurants, navigation, }) {
    return (
        <FlatList 
            data={restaurants}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(restaurant)=> (
                <Restaurant restaurant={restaurant} navigation={navigation} />
            )}
        >

        </FlatList>
    )
}

function Restaurant({ restaurant, navigation }) {
    const {id, name, description, rating, images, } = restaurant.item;
    const [iconColor, setIconColor] = useState('#0000');

    useEffect(() => {
        if(restaurant.index === 0){
            setIconColor('#efb819');
        } else if(restaurant.index === 1){
            setIconColor('#e3e4e5');
        } else if (restaurant.index === 2){
            setIconColor('#cd7f32');
        }
    }, [])

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("restaurants", {
                    screen: "restaurant", 
                    params:{id, name,}
                })}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon 
                    type="material-community" 
                    //name="chess-queen"
                    name="medal"
                    color={iconColor}
                    size={30}
                    containerStyle={styles.containerIcon}
                    underlayColor="transparent">
                </Icon>
                <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    placeholderContent={<ActivityIndicator zise="large" color="#ffff" />}
                    source={{ uri: images[0], }}
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readOnly={true}
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 30,
        borderWidth: 0,
    },

    containerIcon: {
        backgroundColor: "#ffff",
        borderRadius: 100,
        position: 'absolute',
        top: -5,
        left: -5,
        zIndex: 1,
    },

    restaurantImage: {
        width: "100%",
        height: 200,
    },

    title: {
        color: "#3c3c3c",
        fontSize: 18,
        fontWeight: "bold",
    },

    description: {
        color: "#7c7c82",
        marginTop: 0,
        textAlign: 'justify',
    },

    titleRating: {
        flexDirection: 'row',
        marginVertical: 10, 
        justifyContent: 'space-between',
    }
})