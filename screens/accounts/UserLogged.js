import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../../utils/actions';
import Loading from '../../components/Loading';

export default function UserLogged() {

    const navigation = useNavigation();
    const [showLoading, setShowLoading] = useState(false);

    const signOutLocal = () => {
        setShowLoading(true);
        signOut();
        navigation.navigate("restaurants");
        setShowLoading(false);
    };

    return (
        <View>
            <Text>User logged</Text>
            <Button
                containerStyle={styles.btnContainerSignOff}
                buttonStyle={styles.btnSignOff}
                title="Sign off"
                onPress={() => {
                    /*signOut();
                    navigation.navigate("restaurants");*/
                    signOutLocal();
                }}
            />

            <Loading isVisible={showLoading} text="Processing please wait..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    btnSignOff: {
        backgroundColor: "#f2936c",
    },

    btnContainerSignOff: {
        marginTop: 10,
        width: "40%",
        alignSelf: "center",
    },
})