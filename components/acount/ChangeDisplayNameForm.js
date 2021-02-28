import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

export default function ChangeDisplayNameForm({ displayName, setShowModal, toastRef, }) {
    return (
        <View
            style={styles.view}
        >
            <Text>
                Enter new first and last name:
            </Text>
            <Input
                placeholder="Enter first and last name"
                containerStyle={styles.input}
                defaultValue={displayName}
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
