import React, { useState, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, size } from 'lodash';

import { reAuthenticateUserAsync,  } from '../../utils/actions';

export default function ChangePasswordForm({setShowModal, toastRef, }) {

    const [currentPassword, setCurrentPassword] = useState(null);
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [newPassword, setNewPassword] = useState(null);
    const [errorNewPassword, setErrorNewPassword] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);
    const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState(null);
    const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

    const [showLoading, setShowLoading] = useState(false);

    const onSubmit = async () => {
        if(!validateForm()){
            return;
        }
        
        /*setShowLoading(true);
        const resultReAuthentication = await reAuthenticateUserAsync(currentPassword);

        if(!resultReAuthentication.statusResponse){
            setShowLoading(false);
            setErrorCurrentPassword(resultReAuthentication.error.message);
            return;
        }

        const resultUpdateEmail = await updateEmailAsync(newPassword);
        if(!resultUpdateEmail.statusResponse){
            setShowLoading(false);
            setErrorEmail(resultUpdateEmail.error.message);
            return;
        }
        setShowLoading(false);

        setReloadUser(true);
        setShowModal(false);

        toastRef.current.show("The data has been updated successfully", 2000);*/
    }

    const validateForm = () => {
        setErrorCurrentPassword(null);
        setErrorNewPassword(null);
        setErrorNewPasswordConfirm(null);
        let isValid = true;

        if(isEmpty(currentPassword)){
            setErrorCurrentPassword("You must enter your current password.");
            isValid = false;
        }

        if(isEmpty(newPassword)){
            setErrorNewPassword("You must enter your new password.");
            isValid = false;
        }

        if(isEmpty(newPasswordConfirm)){
            setErrorNewPasswordConfirm("You must enter your new password confirm.");
            isValid = false;
        }

        if(isValid){
            if(size(newPassword) < 6){
                setErrorNewPassword("Password must be less than 6 characters.");
                isValid = false;
            }

            if(size(newPasswordConfirm) < 6){
                setErrorNewPasswordConfirm("Password confirm must be less than 6 characters.");
                isValid = false;
            }
        }

        if(isValid){
            if(newPassword !== newPasswordConfirm){
                setErrorNewPassword("The password and confirmation must be the same.");
                setErrorNewPasswordConfirm("The password and confirmation must be the same.");
                isValid = false;
            }
        }

        if(isValid){
            if(newPassword === currentPassword){
                setErrorCurrentPassword("You must enter a different password the the current one.");
                setErrorNewPassword("You must enter a different password the the current one.");
                setErrorNewPasswordConfirm("You must enter a different password the the current one.");
                isValid = false;
            }
        }

        return isValid;
    }

    return (
        <View
            style={styles.view}
        >
            <Text>
                Change password:
            </Text>

            <Input
                containerStyle={styles.input}
                errorMessage={errorCurrentPassword}
                onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
                placeholder="Enter your current password."
                password={true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c2c2c2", }} 
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                }
                secureTextEntry={!showCurrentPassword}
            />

            <Input
                containerStyle={styles.input}
                errorMessage={errorNewPassword}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                placeholder="Enter your new password."
                password={true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c2c2c2", }} 
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    />
                }
                secureTextEntry={!showNewPassword}
            />

            <Input
                containerStyle={styles.input}
                errorMessage={errorNewPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.nativeEvent.text)}
                placeholder="Enter your new password confirm."
                password={true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showNewPasswordConfirm ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{ color: "#c2c2c2", }} 
                        onPress={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                    />
                }
                secureTextEntry={!showNewPasswordConfirm}
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
