import React, {useState, useEffect, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app';

import Loading from '../../components/Loading';

export default function Restaurants() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false);
        });
    }, []);

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
            <Text>Restaurants...</Text>
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#f2936c"
                        reverse={true}
                        containerStyle={styles.btnIconContainer}
                    />
                )
            }
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
    }
})