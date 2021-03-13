import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from '../screens/restaurants/Restaurants';
import AddRestaurant from '../screens/restaurants/AddRestaurant';
import Restaurant from '../screens/restaurants/Restaurant';
import AddReviewRestaurant from '../screens/restaurants/AddReviewRestaurant';

const Stack = createStackNavigator();

export default function RestaurantStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen name="restaurants"
                component={Restaurants}
                options={{title: "Restaurants",}} />
            
            <Stack.Screen name="addRestaurant"
                component={AddRestaurant}
                options={{title: "Add restaurant"}} />

            <Stack.Screen name="restaurant"
                component={Restaurant} />

            <Stack.Screen name="addReviewRestaurant"
                component={AddReviewRestaurant} 
                options={{ title: "New comment", }}/>
                
        </Stack.Navigator>
    );
};
