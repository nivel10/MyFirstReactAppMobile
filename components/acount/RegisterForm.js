import { size } from 'lodash';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import { createUserAsync } from '../../utils/actions';
import { validateEmail } from '../../utils/helpers';

export default function RegisterForm() {

    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValues());

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    };

    const registerUser = async () => {
        if(!validateData()){
            return;
        }
        const resul = await createUserAsync(formData.email, formData.password);
        if(!resul.statusResponse){
            /*console.log(`Error: ${resul.error}`);*/
            setErrorEmail(resul.error);
            return;
        }
        console.log("Ok");
        navigation.navigate("account");
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
        width: "60%",
        alignSelf: "center",
    },

    btnStyle: {
        backgroundColor: "#f2936c",
    },

    icon: {
        color: "#c1c1c1",
    },
})
