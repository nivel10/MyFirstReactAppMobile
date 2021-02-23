import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/*import Restaurants from "../screens/Restaurants";*/
/*import Favorites from "../screens/Favorites";*/
/*import TopRestaurants from "../screens/TopRestaurants";
import Search from "../screens/Serach";
import Account from "../screens/Account";*/
import RestaurantStack from "./RestaurantStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();
const colorActive = "#f2936c";
const colorInactive = "#cccdcf";

export default function Navigation() {

  const screenOptions = (route, color) =>{
    let iconName;

    switch(route.name){
      case "restaurants":
        iconName = "compass-outline";
        break;
      case "favorites":
        iconName = "heart-outline";
        break;
      case "top-restaurants":
        iconName = "star-outline";
        break;
       case "search":
        iconName = "magnify";
        break;
      case "account":
        iconName = "home-outline";
        break;
    };

    return (
      <Icon type="material-community"
        name={iconName}
        size={22}
        color={color}
      />
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="restaurants"
        tabBarOptions={{
          inactiveTintColor: colorInactive,
          activeTintColor: colorActive,
        }}
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => screenOptions(route, color)
          })}
      >

          {/* <Tab.Screen name="restaurants"
            component={Restaurants} 
            options={{title: "Restaurants"}}/> */}

            <Tab.Screen name="restaurants"
              component={RestaurantStack}
              options={{title: "Restaurants",}}/>

          {/*<Tab.Screen name="favorites"
            component={Favorites}
          options={{title: "Favorites"}}/>*/}


          <Tab.Screen name="favorites"
            component={FavoritesStack}
            options={{title: "Favorites",}}/>

          {/*<Tab.Screen name="Top restaurants"
            component={TopRestaurants} 
        options={{title: "Top Restaurants"}}/>*/}

          <Tab.Screen name="top-restaurants"
            component={TopRestaurantsStack} 
            options={{title: "Top Restaurants"}}/>

          {/*<Tab.Screen name="Search"
            component={Search}
            options={{title: "Search"}}/>*/}

          <Tab.Screen name="search"
            component={SearchStack}
            options={{title: "Search"}}/>

          {/*<Tab.Screen name="Account"
            component={Account}
          options={{title: "Account"}}/>*/}

          <Tab.Screen name="account"
            component={AccountStack}
            options={{title: "Account"}}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
}