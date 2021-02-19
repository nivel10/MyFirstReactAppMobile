import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Serach from '../screens/Serach';

const Stack = createStackNavigator();

export default function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="search"
                component={Serach}
                options={{title: "Search",}}/>
        </Stack.Navigator>
    );
}