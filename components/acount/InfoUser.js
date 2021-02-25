import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

export default function InfoUser({ user }) {
  console.log(user);

  return <View 
            style={styles.viewContainer}
        >
            <Avatar
                rounded={true}
                size="large"
                source={
                    user.photoURL !== null ? 
                        {uri: user.photoURL }: 
                            require("../../assets/avatar-default.png")
                }
            />
            <View 
                style={styles.viewInfoUser}
            >
                <Text
                    style={styles.textDisplayName}
                >
                    {
                        user.displayName !== null ?
                            user.displayName :
                                "No name yet"
                    }

                </Text>
                <Text>{user.email}</Text>
            </View>

        </View>;
}

const styles = StyleSheet.create({
  viewContainer: {
      alignItems: "center",
      justifyContent:"center",
      flexDirection:"row",
      backgroundColor: "#f9f9f9",
      paddingVertical: 30,
  },

  viewInfoUser: {
      marginLeft: 20,
  },

  textDisplayName: {
      fontWeight:"bold",
      paddingBottom: 5,
  }

});
