import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Account from '../screens/accounts/Account';
import Login from '../screens/accounts/Login';
import Register from '../screens/accounts/Register';

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

        </Stack.Navigator>
    );
}