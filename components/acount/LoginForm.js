import React, { useState } from 'react'
import { size } from 'lodash';
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { useNavigation } from '@react-navigation/native';

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
                errorMessage={errorEmail}
                placeholder="Enter your email..."
                keyboardType="email-address"
                onChange={(e) => onChangeLocal(e, "email")}
            />

            <Input
                errorMessage={errorPassword}
                placeholder="Enter your password..."
                password={showPassword}
                secureTextEntry={showPassword}
                style={styles.input}
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
        width: "40%",
    },

})