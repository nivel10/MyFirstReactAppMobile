import React, { useEffect, useState, useRef, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input, } from 'react-native-elements';

import Toast from 'react-native-easy-toast';

export default function AddReviewRestaurant({ navigation, route, }) {

    const { idRestaura, name, } = route.params;

    const [corating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [errorTitle, setErrorTitle] = useState(null);
    const [review, setReview] = useState("");
    const [errorReview, setErrorReview] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const toastRef = useRef();

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Bad :/", "Regular :|", "Normal :)", "Good ;)", "Excellent XD",]}
                    defaultRating={0}
                    size={30}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },

    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2",
    }
})