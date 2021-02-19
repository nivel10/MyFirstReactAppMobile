import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Restaurants from "../screens/Restaurants";
import Favorites from "../screens/Favorites";
import TopRestaurants from "../screens/TopRestaurants";
import Search from "../screens/Serach";
import Account from "../screens/Account";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

          <Tab.Screen name="restaurants"
            component={Restaurants} 
            options={{title: "Restaurants"}}/>

          <Tab.Screen name="favorites"
            component={Favorites}
            options={{title: "Favorites"}}/>

          <Tab.Screen name="Top restaurants"
            component={TopRestaurants} 
            options={{title: "Top Restaurants"}}/>

          <Tab.Screen name="Search"
            component={Search}
            options={{title: "Search"}}/>

          <Tab.Screen name="Account"
            component={Account}
            options={{title: "Account"}}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
}