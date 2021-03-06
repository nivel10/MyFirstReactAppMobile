import React, {useCallback, useState, useRef, isValidElement, useEffect, } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input, ListItem, Rating, } from 'react-native-elements';
import { useFocusEffect, } from '@react-navigation/native'
import { isEmpty, map } from 'lodash';

import firebse from 'firebase/app';
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import CarouselImages from '../../components/restaurants/CarouselImages';
import ListReviews from '../../components/restaurants/ListReviews';
import MapRestaurant from '../../components/restaurants/MapRestaurant';
import ModalComponent from '../../components/Modal';

import { addDocumentWithOutIdAsync, getCurrentUser, getDocumentByIdAsync, getDocumentByConditionalAsync, getIsFavoriteAsync, removeIsFavoriteAsync, getUsersFavotiteAsync } from '../../utils/actions';
import { formatPhone, sendEmail, sendWhatsApp, getResponse, callNumber } from '../../utils/helpers';
import firebase from 'firebase/app';
import { Alert } from 'react-native';
//import { isBackgroundLocationAvailableAsync } from 'expo-location';
import { sendPushNotificaionsAsync, setNotificationMessage } from '../../utils/notifications';

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route, }) {

    const {id, name, } = route.params;
    const toastTimeShow = 1500;
    const toastRef = useRef();
    const [restaurant, setRestaurant] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showModalNotification, setShowModalNotification] = useState(false);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
        setCurrentUser(user);
    });

    useFocusEffect(
        useCallback(() => {
            (async() =>{
                const response = await getDocumentByIdAsync("restaurants", id);
                if(response.statusResponse){
                    setRestaurant(response.document);
                } else {
                    setRestaurant({});
                    toastRef.current.show(response.error.message, toastTimeShow);
                }
            })()
            navigation.setOptions({ title: name, });
        }, [])
    );

    useEffect(() => {
        (async() => {
            if(userLogged && restaurant){
                const response = await getIsFavoriteAsync(restaurant.id);
                if(response.statusResponse){
                    setIsFavorite(response.isFavorite);
                } else {
                    toastRef.current.show(response.error.message, toastTimeShow);
                }
            }
        })()
    }, [userLogged, restaurant]);

    if(!restaurant){
        return ( 
            <Loading 
                isVisible={true} 
                text="Loading please wait..." 
            />
        )
    }

    const addFavorite = async() =>{
        if(!userLogged){
            toastRef.current.show("To add restaurant to favorite you must be logged in.", toastTimeShow);
            return;
        }

        setShowLoading(true);
        const data = {
            idUser : getCurrentUser().uid,
            idRestaurant: restaurant.id,
        };
        const response = await addDocumentWithOutIdAsync("favorites", data);
        setShowLoading(false);
        if(response.statusResponse){
            setIsFavorite(true);
            toastRef.current.show("Restaurant added to favorites.", toastTimeShow);
        } else {
            toastRef.current.show(response.error.message, toastTimeShow);
        }
    }

    const removeFavorite = async() =>{
        setShowLoading(true);
        const response = await removeIsFavoriteAsync(restaurant.id);
        setShowLoading(false);
        if(!response.statusResponse){
            toastRef.current.show(response.error.message, toastTimeShow);
        } else {
            setIsFavorite(false);
            toastRef.current.show("Restaurant remove from favorites.", toastTimeShow);
        }
    }

    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages 
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
             <View style={styles.viewFavorite}>
                <Icon
                    color={isFavorite ? "#f2936c" : "#7c7c82"}
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    type="material-community"
                    size={25}
                    underlayColor="transparent"
                />
            </View>
            <RestaurantTitle 
                name={restaurant.name} 
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formatPhone(restaurant.callingCode, restaurant.phone)}
                currentUser={currentUser}
                setShowLoading={setShowLoading}
                setShowModalNotification={setShowModalNotification}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
                name={restaurant.name}/>
            <ModalNotification 
                showModalNotification={showModalNotification}
                setShowModalNotification={setShowModalNotification}
                setShowLoading={setShowLoading}
                restaurant={restaurant}
                currentUser={currentUser}
                />
            <Toast
                ref={toastRef} 
                position="center"
                opacity={0.9} 
            />
            <Loading 
                isVisible={showLoading} 
                text="Processing please wait..."/>
        </ScrollView>
    )
}

function RestaurantTitle({name, description, rating, }){
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={styles.viewRestaurantContainer}>
                <Text style={styles.restaurantName}>{name}</Text>
                <Rating 
                    imageSize={12}
                    readOnly={true}
                    startingValue={parseFloat(rating)}
                    style={styles.rating}/>
            </View>
            <Text style={styles.restaurantDescription}>{description}</Text>
        </View>
    );
}

function RestaurantInfo({ name, location, address, email, phone, currentUser, setShowLoading, setShowModalNotification, }){
    const listInfo = [
        { text: address, iconLeft: "map-marker", iconRight: "message-text-outline", actionLeft: "", actionRight: "sendNotification",},
        { text: phone, iconLeft: "phone", iconRight: "whatsapp", actionLeft: "callNumber", actionRight: "sendWhatsApp", },
        { text: email, iconLeft: "email", iconRight: "email-send", actionLeft: "", actionRight: "sendEmail", },
    ];

    /*const localSendPushNotificaionsAsync = async() => {
        let response = getResponse();
        try{
            if(currentUser === null || isEmpty(currentUser)){
                Alert.alert('Warning', 'You must log in to run this process.');
            } else {
                setShowLoading(true);
                response = await getDocumentByConditionalAsync('notificationsToken', 'idUser', '=', currentUser.uid);
                if(response.isSuccess){
                    const data = response.result;
                    if(data.length > 0){
                        const notificationToken = data[0].token;
                        const messageNotification = setNotificationMessage(
                            notificationToken,
                            'Title test',
                            'Message test',
                            { data: 'Test data'},
                        );

                        response = await sendPushNotificaionsAsync(messageNotification);
                        setShowLoading(false);
                        if(response.isSuccess){
                            Alert.alert('Information', 'Notification has been sent.');
                        } else {
                            Alert.alert('Error', response.msgText);
                        }
                    } else {
                        setShowLoading(false);
                        Alert.alert('Warning', 'You do not have a defined token.');        
                    }
                }
                setShowLoading(false);
            }
        } catch(ex){
            setShowLoading(false);
            response.isSuccess = false;
            response.msgType = -1;
            response.msgText = `${ex.code} - ${ex.message}`;
        }
        return response;
    }*/

    const iconAction = async (item, action) =>{
        let response = getResponse();
        let body = null;
        if(currentUser){
            body = `Hello, i'm ${currentUser.displayName}, i'm interested in your services.`;
        } else {
            body = `Hello, i'm interested in your services.`;
        }
        switch(action){
            case 'callNumber': 
                response = callNumber(item.text);
            break;

            case 'sendEmail':
                response = sendEmail(item.text, 'Contact them', body);
            break;

            case 'sendNotification':
                //response = await localSendPushNotificaionsAsync();
                setShowModalNotification(true);
            break;

            case 'sendWhatsApp':
                sendWhatsApp(item.text, body);
            break;
        }
        if(!response.isSuccess){
            Alert.alert(response.msgType === 1 ? 'Warning' : 'Error', response.msgText);
        }
    }

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Restaurant information:</Text>
            <MapRestaurant 
                location={location}
                name={name}
                height={150}/>
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon 
                            type="material-community"
                            name={item.iconLeft}
                            color="#f2936c"
                            onPress={
                                (item.actionLeft && !isEmpty(item.actionLeft)) && (
                                    () => {iconAction(item, item.actionLeft)}
                                )
                            }
                        />
                        <ListItem.Content>
                            <ListItem.Title style={{color: "#7c7c82"}}>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (

                                <Icon 
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#f2936c"
                                    onPress={
                                        (item.actionRight && !isEmpty(item.actionRight)) && (
                                            () => {iconAction(item, item.actionRight)}
                                        )
                                    }
                                />
                            )
                        }
                        
                    </ListItem>
                ))
            }
        </View>
    );
}

function ModalNotification({showModalNotification, setShowModalNotification, setShowLoading, restaurant, currentUser, }){
    const [title, setTitle] = useState('');
    const [errorTitle, setErrorTitle] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userName] = useState(currentUser === null  ? 'Anonymous' : (currentUser.displayName ? currentUser.displayName : 'Anonymous'));

    const validateForm = () => {
        let response = getResponse();
        try{
            if(isEmpty(title)){
                response.isWarning = true;
                //response.msgText = 'You must enter a title';
                setErrorTitle('You must enter a title');
            }
            if(isEmpty(message)){
                response.isWarning = true;
                //response.msgText = 'You must enter a message';
                setErrorMessage('You must enter a message');
            }
        } catch(ex){
            response.isSuccess = false;
            response.msgType = -1;
            response.msgText = `${ex.code} - ${ex.message}`;
        }
        return response;
    }

    const localSendPushNotificaionsAsync = async() => {
        let response = getResponse();
        try{
            const messageBody = `${message}, of the restaurant: ${restaurant.name}`;

            if(currentUser === null || isEmpty(currentUser)){
                Alert.alert('Warning', 'You must log in to run this process.');
            } else {
                response = validateForm();
                if(response.isSuccess && !response.isWarning){
                    setShowLoading(true);

                    //#region Old code

                   /*response = await getDocumentByConditionalAsync('notificationsToken', 'idUser', '=', currentUser.uid);
                    if(response.isSuccess){
                        const data = response.result;
                        if(data.length > 0){
                            const notificationToken = data[0].token;
                            const messageNotification = setNotificationMessage(
                                notificationToken,
                                `${userName}, comment: ${title}`,
                                messageBody,
                                { data: messageBody},
                            );

                            response = await sendPushNotificaionsAsync(messageNotification);
                            setShowLoading(false);
                            if(response.isSuccess){
                                Alert.alert('Information', 'Notification has been sent.');
                            } else {
                                Alert.alert('Error', response.msgText);
                            }
                        } else {
                            setShowLoading(false);
                            Alert.alert('Warning', 'You do not have a defined token.');        
                        }
                    }*/

                    //#endregion Old code

                    response = await getUsersFavotiteAsync(restaurant.id);
                    if(response.isSuccess){
                        const notificationsToken = response.result;
                        if(notificationsToken.length > 0){
                            await Promise.all(
                                map(notificationsToken, async(notificationToken) => {
                                    // Get message
                                    const messageNotification = setNotificationMessage(
                                        notificationToken.token,
                                        `${userName}, comment: ${title}`,
                                        messageBody,
                                        { data: messageBody},
                                    );
                                    // send notification (push)
                                    await sendPushNotificaionsAsync(messageNotification);
                                })
                            )
                        } 
                        setShowLoading(false);
                        Alert.alert('Information', 'Notification has been sent.');
                    } else {
                        setShowLoading(false);
                        Alert.alert('Error', response.msgText);
                    }
                    setTitle('');
                    setMessage('');
                    setShowModalNotification(false);
                }
            }
        } catch(ex){
            setShowLoading(false);
            response.isSuccess = false;
            response.msgType = -1;
            response.msgText = `${ex.code} - ${ex.message}`;
        }
        //return response;
    }

    return(
        <ModalComponent 
            isVisible={showModalNotification} 
            setVisible={setShowModalNotification}>
                <View style={styles.modalContainer}>
                    <Text style={styles.textModal}>
                        Send a message to restaurant lovers:
                    </Text>
                    <Text style={styles.textNameRestaurant}>
                        {restaurant.name}
                    </Text>
                    <Input 
                        placeholder='Message title' 
                        onChangeText={(e) => setTitle(e)}
                        value={title}
                        errorMessage={errorTitle}
                    />
                     <Input 
                        placeholder='Message'
                        multiline={true}
                        inputStyle={styles.textArea}
                        onChangeText={(e) => setMessage(e)}
                        value={message}
                        errorMessage={errorMessage}
                    />
                    <Button 
                        title='Send'
                        buttonStyle={styles.btnSend}
                        containerStyle={styles.btnSendContainer}
                        onPress={()=> localSendPushNotificaionsAsync()}
                    />
                </View>
        </ModalComponent>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        backgroundColor: "#ffff",
        flex: 1,
    },

    viewRestaurantTitle: {
        padding: 15,
    },

    viewRestaurantContainer: {
        flexDirection: "row",
    },

    restaurantName: {
        fontWeight: "bold",
        color: "#3c3c3c",
    },

    rating: {
        backgroundColor: "transparent",
        position: "absolute",
        right: 0,
    },

    restaurantDescription: {
        marginTop: 10,
        color: "#7c7c82",
        textAlign: "justify",
    },

    viewRestaurantInfo: {
        margin: 10,
    },

    restaurantInfoTitle: {
        color: "#3c3c3c",
        fontWeight: "bold",
        marginBottom: 10,
        textDecorationLine: "underline",
    },

    containerListItem: {
        borderBottomColor: "#917464",
        borderBottomWidth: 0.4,
    },

    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#ffff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 10,
    },

    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    textModal: {
        //color: '#f2936c',
        color: '#7c7c82',
        fontSize: 14,
        fontWeight: 'bold',
    },

    textNameRestaurant: {
        color: '#f2936c',
        fontWeight: 'bold',
        fontSize: 16,
    },

    textArea: {
        height: 50,
        paddingHorizontal: 10,
    },

    btnSend: {
        backgroundColor: '#f2936c',
    },

    btnSendContainer: {
        width: '40%',
    },
})