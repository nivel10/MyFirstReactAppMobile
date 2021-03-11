import React, {useRef, useState, }from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import AddRestaurantForm from '../../components/restaurants/AddRestaurantForm'
import Loading from '../../components/Loading';

export default function AddRestaurant({ navigation, }) {
    const toastRef = useRef();
    const [showLoading, setShowLoading] = useState(false);

    return (
        <KeyboardAwareScrollView>
            <AddRestaurantForm
                toastRef={toastRef}
                setShowLoading={setShowLoading}
                navigation={navigation}
            />

            <Loading 
                isVisible={showLoading}
                text="Creating restaurant, please wait..."
            />
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})