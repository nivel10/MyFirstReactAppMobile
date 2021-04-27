import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Account from '../screens/accounts/Account';
import Login from '../screens/accounts/Login';
import Register from '../screens/accounts/Register';
import RecoverPassword from '../screens/accounts/RecoverPassword';

const Stack = createStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name="account"
                component={Account}
                options={{title: "Account",}}/>

            <Stack.Screen
                name="login"
                component={Login}
                options={{title: "Log in", }}/>

            <Stack.Screen
                name="register"
                component={Register}
                options={{title: "Register user",}}/>

            <Stack.Screen
                name="recover-password"
                component={RecoverPassword}
                options={{title: "Recover password",}}/>

        </Stack.Navigator>
    );
}