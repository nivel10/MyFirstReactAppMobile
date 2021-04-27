import { isEmpty } from 'lodash';
import React, { useState, } from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements';

import Loading from '../../components/Loading';
import { getResponse, validateEmail } from '../../utils/helpers';

export default function RecoverPassword({ navigation, }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showLoding, setShowLoding] = useState(false);

    const changeDataEmail = (value) =>{
        setEmailError('');
        setEmail(value);
    }

    const formValidateData = () => {
        setEmailError('');
        let isValid = false;

        if(isEmpty(email)){
            setEmailError('You must enter an email.');
        } else {
            if(!validateEmail(email)){
                setEmailError('You must enter a valid email.');
            } else {
                isValid = true;
            }
        }
        return isValid;
    }

    const localRecoveryPassword = async() => {
        let response = getResponse();
        try{
            console.log(email);

            if(!formValidateData()){
                response.isWarning = true
            }

        } catch(ex){
            setShowLoding(false);
            response.isSuccess = false;
            response.msgType = -1;
            response.msgText = `${ex.code} - ${ex.message}`;
        }
        if(!response.isSuccess){
            Alert.alert(response.msgType === -1 ? 'Error' : 'Warning', response.msgText);
        } else if(!response.isWarning) {
            Alert.alert('Information', 'All ok mate....');
        }
    }

    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/fhb.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.formContainer}>
                <Input
                    placeholder='Enter your email'
                    contaninerStyle={styles.inputForm}
                    onChange={(e) => changeDataEmail(e.nativeEvent.text)}
                    defaultValue={email}
                    errorMessage={emailError}
                    keyboardType='email-address'
                    rightIcon={
                        <Icon
                            name='email-outline'
                            type='material-community'
                            iconStyle={styles.icon}
                        />
                    }
                />
                <Button
                    buttonStyle={styles.btnReover}
                    contaninerStyle={styles.btnContainer}
                    title='Recover password'
                    onPress={() => localRecoveryPassword()}
                />

                <Loading isVisible={showLoding} text='Recovering password'/>
            </View>
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

    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    inputForm: {
        width: '90%',

    },

    btnContainer: {
        marginTop: 20,
        width: '85%',
        alignSelf: 'center',
    },

    btnReover: {
        backgroundColor: '#f2936c',
    },

    icon: {
        //color: '#f2936c',
        color: '#c1c1c1',
    }
})
