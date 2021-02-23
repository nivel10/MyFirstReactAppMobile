import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RegisterForm from '../../components/acount/RegisterForm'

export default function Register() {
    return (
        <KeyboardAwareScrollView
            style={styles.container}
        >
              <Image
                source={require("../../assets/fhb.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <RegisterForm/>
        </KeyboardAwareScrollView>
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
        flex: 1,
        marginTop: 30,
    },
})
