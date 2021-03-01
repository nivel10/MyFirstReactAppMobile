import React, { useState, useEffect, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { isEmpty } from 'lodash';

import { updateProfileAsync } from '../../utils/actions';

export default function ChangeDisplayNameForm({ displayName, setShowModal, toastRef, setReloadUser, }) {

    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [errorDisplayName, setErrorDisplayName] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    /*useEffect(() => {
        setNewDisplayName(displayName);
    }, [])*/

    const onSubmit = async () => {
        if(!validateForm()){
            return;
        }

        setShowLoading(true);
        const result = await updateProfileAsync({ displayName: newDisplayName, });
        setShowLoading(false);

        if(!result.statusResponse){
            setErrorDisplayName(result.error.message);
            return;
        }

        setReloadUser(true);
        setShowModal(false);

        toastRef.current.show("The data has been updated successfully", 2000);
    }

    const validateForm = () => {
        setErrorDisplayName(null);

        if(isEmpty(newDisplayName)){
            setErrorDisplayName("You must enter first and last name.");
            return false;
        }

        if(displayName === newDisplayName){
            setErrorDisplayName("You must enter first and last name different from the current ones.");
            return false;
        }

        return true;
    }

    return (
        <View
            style={styles.view}
        >
            <Text>
                Enter new first and last name:
            </Text>
            <Input
                containerStyle={styles.input}
                defaultValue={displayName}
                errorMessage={errorDisplayName}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                placeholder="Enter first and last name"
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2",
                }}
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
