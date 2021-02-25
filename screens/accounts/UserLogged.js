import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Toast from 'react-native-easy-toast';

import { useNavigation } from '@react-navigation/native';

import { getCurrentUser, signOut } from '../../utils/actions';
import Loading from '../../components/Loading';
import InfoUser from '../../components/acount/InfoUser';

export default function UserLogged() {

    const navigation = useNavigation();
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [user, setUser] = useState(null);

    const toastRef = useRef();

    const signOutLocal = () => {
        setShowLoading(true);
        signOut();
        navigation.navigate("restaurants");
        setShowLoading(false);
    };

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    return (
        <View>
            {
                user && <InfoUser user={user}/>
            }
            <Text>Account options</Text>
            <Button
                buttonStyle={styles.btnSignOff}
                containerStyle={styles.btnSignOffContainer}
                title="Sign off"
                /*titleStyle={styles.btnSignOffTitle}*/
                onPress={() => {
                    /*signOut();
                    navigation.navigate("restaurants");*/
                    signOutLocal();
                }}
            />

            <Loading isVisible={showLoading} text="Processing please wait..."/>
            <Toast  ref={toastRef} position="center" opacity={0.9}/>
        </View>
    )
}

const styles = StyleSheet.create({
    btnSignOff: {
        /*backgroundColor: "#ffff",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopColor: "#f2936c",
        borderBottomColor: "#f2936c",
        borderLeftColor: "#f2936c",
        borderRightColor: "#f2936c",*/
        backgroundColor: "#f2936c",
        borderRadius: 5,
        marginTop: 30,
        paddingVertical: 10,
    },

    btnSignOffContainer: {
        marginTop: 10,
        width: "40%",
        alignSelf: "center",
    },

    /*btnSignOffTitle: {
        color: "#f2936c",
    }*/
})