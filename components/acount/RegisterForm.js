import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';

export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <View
            style={styles.form}
        >
            {/*<Icon type="material-community" name="email-outline" size="22"/>*/}
            <Input
                containerStyle={styles.input}
                placeholder="Enter your email"
            />
            <Input
                containerStyle={styles.input}
                placeholder="Enter your password"
                password={!showPassword}
                secureTextEntry={!showPassword}
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
                placeholder="Confirm your password"
                password={!showPassword}
                secureTextEntry={!showPassword}
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
                onPress={() => console.log('click')}
            />

        </View>
    )
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
