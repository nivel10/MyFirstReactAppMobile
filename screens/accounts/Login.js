import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import { Divider } from 'react-native-elements'

export default function Login() {
    return (
        <ScrollView>
            <Image
                source={require("../../assets/fhb.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View
                style={styles.container}
            >
                <Text>Login form</Text>
                <CreateAccount/>
            </View>

            <Divider
                style={styles.divider}
            />

        </ScrollView>
    )
}

function CreateAccount(props) {
    return (
    <Text 
        style={styles.register}
        onPress={() => console.log('Register')}>
        Do not have an account yet?{" "}
        <Text 
            style={styles.btnRegister}>
            Register
        </Text>
    </Text> 
    )   
}

const styles = StyleSheet.create({
    image: {
        height: 150,
        width: "100%",
        marginBottom: 30,
        marginTop: 10,
    },

    container:{
        marginHorizontal: 40,
    },

    divider: {
        backgroundColor: "#f2936c",
        margin: 40,
    },

    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },

    btnRegister: {
        color:"#f2936c",
        fontWeight: "bold",
    },
})