import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../../utils/actions';

export default function UserLogged() {

    const navigation = useNavigation();

    return (
        <View>
            <Text>User logged</Text>
            <Button
                containerStyle={styles.btnContainerSignOff}
                buttonStyle={styles.btnSignOff}
                title="Sign off"
                onPress={() => {
                    signOut();
                    navigation.navigate("restaurants");
                }}
            />
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