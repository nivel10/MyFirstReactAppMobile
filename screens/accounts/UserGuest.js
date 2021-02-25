import React from 'react'
import { Button } from 'react-native-elements';
import { StyleSheet, Text, ScrollView, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';  

export default function UserGuest() {
    const navigation = useNavigation();

    return (
        <ScrollView
            centerContent={true}
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/fhb.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text
                style={styles.title}
            >
                Check your profile in restaurant 
            </Text>
            <Text
                style={styles.description}
            >
                How would you describe your best restaurant? Search and view the best restaurants in a simple way, vote which one you liked the most and comment on how your experience has been.
            </Text>

            <Button
                containerStyle={styles.btnProfileContainer}
                title="Your profile"
                buttonStyle={styles.btnProfile}
                onPress={() => navigation.navigate("login")}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },

    image: {
        height: 300,
        width: "100%",
        marginBottom: 10,
        /*textAlign: "center",*/
    },

    title: {
        fontWeight:"bold",
        fontSize: 19,
        marginVertical:10,
        textAlign: "center"
    },

    description: {
        textAlign: "justify",
        marginBottom: 20,
        color: "#917464",
    },

    btnProfile: {
        backgroundColor: "#f2936c",
        borderRadius: 5,
    },

    btnProfileContainer: {
        alignSelf: "center",
        width: "40%",
    },
});