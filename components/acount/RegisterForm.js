import React, {useState} from 'react';
import { size } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import { addDocumentWithIdAsync, addDocumentWithOutIdAsync, createUserAsync, getCurrentUser } from '../../utils/actions';
import { getResponse, validateEmail } from '../../utils/helpers';
import Loading from '../Loading';
import { getNotificationTokenAsyn, getToken } from '../../utils/notifications';
import { Alert } from 'react-native';

export default function RegisterForm() {

    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValues());

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

    const [showLoading, setShowLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    };

    const registerUser = async () => {
        let response = getResponse();
        try{
            if(!validateData()){
                return;
            }

            setShowLoading(true);
            const resul = await createUserAsync(formData.email, formData.password);

            if(!resul.statusResponse){
                setErrorEmail(resul.error);
                setShowLoading(false);
                return;
            }

            // Get notification token
            response = await getNotificationTokenAsyn();
            //response = await getToken();
            if(response.isSuccess && !response.isWarning){
                //response = await addDocumentWithIdAsync('users', { userId: getCurrentUser().uid, token: response.resul, }, getCurrentUser().uid);
                response = await addDocumentWithOutIdAsync('notificationsToken', { idUser: getCurrentUser().uid, token: response.result, });
                if(!response.statusResponse){
                    setShowLoading(false);
                    Alert.alert('Error', `${response.error.code} - ${response.error.message}`);
                    return;
                }
            } else {
                setShowLoading(false);
                Alert.alert(response.isWarning ? 'Warning' : 'Error', response.msgText);
                return;
            }

            setShowLoading(false);
            navigation.navigate("account");
        } catch(ex){
            setShowLoading(false);
            response.isSuccess = false;
            response.msgType = -1;
            response.msgText = `${ex.code} - ${ex.message}`;
            Alert.alert('Error', response.msgText);
        }
    }

    const validateData = () => {
        setErrorEmail("");
        setErrorPassword("");
        setErrorPasswordConfirm("");
        let isValid = true;

        if(!validateEmail(formData.email)){
            setErrorEmail("Your must enter a valid email.");
            isValid = false;
        }

        if(size(formData.password) < 6){
            setErrorPassword("Your must enter a password of at least 6 characters.");
            isValid = false;
        }

        if(size(formData.passwordConfirm) < 6){
            setErrorPasswordConfirm("Your must enter a password of at least 6 characters.");
            isValid = false;
        }

        if(formData.password !== formData.passwordConfirm){
            setErrorPassword("Password and password confirm are not the same.");
            setErrorPasswordConfirm("Password and password confirm are not the same.");
            isValid = false;
        }

        return isValid;
    }

    return (
        <View
            style={styles.form}
        >
            {/*<Icon type="material-community" name="email-outline" size="22"/>*/}
            <Input
                containerStyle={styles.input}
                placeholder="Enter your email"
                onChange={(e) => onChange(e, "email")}
                keyboardType="email-address"
                defaultValue={formData.email}
                errorMessage={errorEmail}
            />
            <Input
                containerStyle={styles.input}
                defaultValue={formData.password}
                errorMessage={errorPassword}
                placeholder="Enter your password"
                password={!showPassword}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                <Icon
                    type="material-community"
                    name={!showPassword ? "eye-outline" : "eye-off-outline"}
                    iconStyle={styles.icon}
                    onPress={() => setShowPassword(!showPassword)}
                />
            }
            />
            <Input
                containerStyle={styles.input}
                defaultValue={formData.passwordConfirm}
                errorMessage={errorPasswordConfirm}
                placeholder="Confirm your password"
                password={!showPassword}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "passwordConfirm")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={!showPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />

            <Button
                title="Register user"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnStyle}
                onPress={() => registerUser()}
            />

            <Loading isVisible={showLoading} text="Processing please wait..."/>

        </View>
    )
}

const defaultFormValues = () => {
    return {email: "", password: "", passwordConfirm: ""};
}

const styles = StyleSheet.create({
    form: {
        marginTop: 10,
    },

    input: {
        width: "100%",
    },

    btnContainer: {
        marginTop: 20,
        width: "40%",
        alignSelf: "center",
    },

    btnStyle: {
        backgroundColor: "#f2936c",
        borderRadius: 5,
    },

    icon: {
        color: "#c1c1c1",
    },
})
