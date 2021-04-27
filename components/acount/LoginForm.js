import React, { useState } from 'react'
import { size } from 'lodash';
import { StyleSheet, Text, View, Platform, Alert, } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { useNavigation } from '@react-navigation/native';

import * as GoogleSignIn from 'expo-google-sign-in';
import * as firebase from 'firebase';

import { loginWithEmailAndPasswordAsync } from '../../utils/actions';
import { validateEmail } from '../../utils/helpers';

import Loading from '../Loading';

const setDefaultFormValues = () => {
    return {email: "", password: "", };
};

export default function LoginForm() {

    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState(setDefaultFormValues());

    const [showLoading, setShowLoading] = useState(false);

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const onChangeLocal = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text, })
    }

    const validateForm = () => {
        let isValid = true;
        setErrorEmail("")
        setErrorPassword("");

        if(!validateEmail(formData.email)){
            setErrorEmail("Your must enter an valid email.");
            isValid = false;
        }

        if(size(formData.password) < 6){
            setErrorPassword("Your must enter a password of at least 6 characters.");
            isValid = false;
        }
        return isValid;
    }

    async function googleSignInAsync() {
        try {
            await GoogleSignIn.initAsync()
            if (Platform.OS === "android") {
                await GoogleSignIn.askForPlayServicesAsync();
            }
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === "success") {
                onSignIn(user)
                setShowLoading(false)
                return true
            } else {
                setShowLoading(false)
                Alert.alert('Warning', JSON.stringify(result))
                return { cancelled: true }
            }
        } catch (error) {
            setShowLoading(false)
            Alert.alert('Error', error.message)
            return { error: true }
        }
    }

    function onSignIn(googleUser) {
        const unsubscribe = firebase
            .auth()
            .onAuthStateChanged(function (firebaseUser) {
                unsubscribe()
                if (!isUserEqual(googleUser, firebaseUser)) {
                    const credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.auth.idToken,
                        googleUser.auth.accessToken
                    )
                    setShowLoading(true);
                    firebase
                        .auth()
                        .signInWithCredential(credential)
                        .then(() => {
                            setShowLoading(false)
                        })
                        .catch(function (error) {
                            setShowLoading(false)
                            Alert.alert(error.message)
                        })
                } else {
                    Alert.alert('Warning', 'User is logged in.');
                }
            });
    }

    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
            let providerData = firebaseUser.providerData
            for (let i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true
                }
            }
        }
        return false
    }

    const loginUserLocalAsync = async () => {
        if(!validateForm())
        {
            return;
        }
        setShowLoading(true);
        const result = await loginWithEmailAndPasswordAsync(formData.email, formData.password);
        setShowLoading(false);

        if(!result.statusResponse)
        {
            setErrorEmail(result.error);
            return;
        }

        setShowLoading(true);
        navigation.navigate("account");
        setShowLoading(false);
    }

    return (
        <View
            style={styles.container}
        >
            <Input
                containerStyle={styles.input}
                defaultValue={formData.email}
                errorMessage={errorEmail}
                placeholder="Enter your email..."
                keyboardType="email-address"
                onChange={(e) => onChangeLocal(e, "email")}
            />

            <Input
                containerStyle={styles.input}
                defaultValue={formData.password}
                errorMessage={errorPassword}
                placeholder="Enter your password..."
                password={showPassword}
                secureTextEntry={showPassword}
                onChange={(e) => onChangeLocal(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconStylePassword}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Login"
                containerStyle={styles.btnLoginContainer}
                buttonStyle={styles.btnLogin}
                onPress={() => loginUserLocalAsync()}
            />
            <Button
                icon={
                    <Icon
                        name="google"
                        type="material-community"
                        marginRight={10}
                        size={20}
                        color="#ffff"
                    />
                }
                title="Login with Google"
                containerStyle={styles.btnLoginContainer}
                buttonStyle={styles.btnLoginGoogle}
                onPress={() => googleSignInAsync()}
            />

            <Loading isVisible={showLoading} text="Starting session please wait..." />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    iconStylePassword: {
        color: "#c1c1c1",
    },

    input: {
        width: "100%",
    },

    btnLogin: {
        backgroundColor: "#f2936c",
        borderRadius: 5,
    },

    btnLoginContainer: {
        alignSelf: "center",
        width: "55%",
    },

    btnLoginGoogle:{
        backgroundColor: "#ea4335",
        borderRadius: 5,
        marginTop: 5,
    },

})