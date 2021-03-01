import React, { useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty } from 'lodash';

import { reAuthenticateUserAsync, updateEmailAsync, } from '../../utils/actions';
import { validateEmail } from '../../utils/helpers';

export default function ChangeEmailForm({ email, setShowModal, toastRef, setReloadUser, }) {

    const [newEmail, setNewEmail] = useState(email);
    const [password, setPassword] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const onSubmit = async () => {
        if(!validateForm()){
            return;
        }
        
        setShowLoading(true);
        const resultReAuthentication = await reAuthenticateUserAsync(password);

        if(!resultReAuthentication.statusResponse){
            setShowLoading(false);
            setErrorPassword(resultReAuthentication.error.message);
            return;
        }

        const resultUpdateEmail = await updateEmailAsync(newEmail);
        if(!resultUpdateEmail.statusResponse){
            setShowLoading(false);
            setErrorEmail(resultUpdateEmail.error.message);
            return;
        }
        setShowLoading(false);

        setReloadUser(true);
        setShowModal(false);

        toastRef.current.show("The data has been updated successfully", 2000);
    }

    const validateForm = () => {
        setErrorEmail(null);
        setErrorPassword(null);
        let isValid = true;

        if(!validateEmail(newEmail)){
            setErrorEmail("You must enter a valid email.");
            isValid = false;
        }

        if(newEmail === email){
            setErrorEmail("You must enter a different email than the current one.");
            isValid = false;
        }

        if(isEmpty(password)){
            setErrorPassword("You must enter your current password.");
            isValid = false;
        }

        return isValid;
    }

    return (
        <View
            style={styles.view}
        >
            <Text>
                Change email:
            </Text>
            <Input
                containerStyle={styles.input}
                defaultValue={email}
                errorMessage={errorEmail}
                keyboardType={'email-address'}
                onChange={(e) => setNewEmail(e.nativeEvent.text)}
                placeholder="Enter your new email."
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2",
                }}
            />

            <Input
                containerStyle={styles.input}
                defaultValue={password}
                errorMessage={errorPassword}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                placeholder="Enter your current password."
                password={true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c2c2c2", }} 
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                secureTextEntry={!showPassword}
            />

            <Button
                title="Save changes"
                containerStyle={styles.btnContainet}
                buttonStyle={styles.btnStyle}
                onPress={onSubmit}
                loading={showLoading}
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical: 10,
    },

    input: {
        marginBottom: 10,
    },

    btnContainer: {
        width: "80%",
    },

    btnStyle: {
        backgroundColor: "#f2936c",
    },
})
