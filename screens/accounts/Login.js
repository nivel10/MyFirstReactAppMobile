import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import { Divider } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useNavigation } from '@react-navigation/native'
import LoginForm from '../../components/acount/LoginForm'

export default function Login() {
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/fhb.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View
                style={styles.container}
            >
                <LoginForm/>
                <CreateAccount/>
                <RecoverPassword/>
            </View>

            <Divider
                style={styles.divider}
            />

        </KeyboardAwareScrollView>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation();

    return (
    <Text 
        style={styles.register}
        onPress={() => navigation.navigate("register")}>
        Do not have an account yet?{" "}
        <Text 
            style={styles.btnRegister}>
            Register
        </Text>
    </Text> 
    )   
}

function RecoverPassword(){
    const navigation = useNavigation();
    return(
        <Text 
            onPress={() => navigation.navigate('recover-password')}
            style={styles.register}>
            Did you forget your password?{' '}
            <Text style={styles.btnRegister}>
                get it back
            </Text>
        </Text>
    );
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