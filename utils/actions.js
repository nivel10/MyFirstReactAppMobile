import {firebaseApp} from './firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

import { fileToBlobAsync } from '../utils/helpers'

const db = firebase.firestore(firebaseApp);

export const isUserLogged = () =>{
    let isLogged = false;

    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLogged = true);
        //user !== null ? isLogged = true : isLogged = false;
        //console.log(`onAuthStateChanged: ${user}`);
    })
    return isLogged;
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
}

export const createUserAsync = async (email, password) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (ex){
            //console.log(`${ex.code} - ${ex.message}`);
            result.statusResponse = false;
            result.error = ex.message;
        });
    } catch (ex) {
        //console.log(ex);
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const signOut = () => {
    firebase.auth().signOut();
}

export const loginWithEmailAndPasswordAsync = async (email, password) => {
    const result = {statusResponse: true, error: null};
    try{
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (ex) {
            ///console.log(`${ex.code} - ${ex.message}`);
            switch(ex.code){
                case 'auth/user-not-found':
                    break;
                case 'auth/wrong-password':
                    break;
            }
           result.statusResponse = false;
           result.error = ex.message;
        });
    }
    catch(ex){
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const uploadImageAsync = async (image, path, name) => {
    const result = {statusResponse: false, error: null, url: null, };
    try {
        const ref = firebase.storage().ref(path).child(name);
        const blob = await fileToBlobAsync(image);

        await ref.put(blob);
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL();
        result.statusResponse = true;
        result.url = url;
    } catch (ex) {
        result.error = ex;
    }
    return result;
}

export const updateProfileAsync = async (data) => {
    const result = {statusResponse: true, error: null,};
    try {
        await firebase.auth().currentUser.updateProfile(data);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const reAuthenticateUserAsync = async (password) => {
    const result = {statusResponse: true, error: null,};
    try {
        const user = getCurrentUser();
        const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credentials);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const updateEmailAsync = async (email) => {
    const result = {statusResponse: true, error: null,};
    try {
        await firebase.auth().currentUser.updateEmail(email);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const updatePasswordAsync = async (newPassword) => {
    const result = {statusResponse: true, error: null, };
    try {
        await firebase.auth().currentUser.updatePassword(newPassword);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const addDocumentWithOutIdAsync = async(collection, data) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await db.collection(collection).add(data);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const updateDocumentByIdAsync = async(collection, id, data) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await db.collection(collection).doc(id).update(data);
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const getDocumentByIdAsync = async(collection, id) =>{
    const result = { statusResponse: true, document: null, error: null, };
    try {
        const response = await db.collection(collection).doc(id).get();
        result.document = response.data();
        result.document.id = response.id;
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const getRestaurantsAsync = async(limitRestaurants) => {
    const result = {statusResponse: true, error: null, restaurants: [], startRestaurant: null, };
    try {
        const response = await db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurants)
            .get();
        if(response.docs.length > 0){
            result.startRestaurant = response.docs[response.docs.length - 1];

            response.forEach((doc) => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                result.restaurants.push(restaurant);
            })
        }
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const getMoreRestaurantsAsync = async(limitRestaurants, startRestaurant) =>{
    const result = {statusResponse: true, error: null, restaurants: [], startRestaurant: null, };
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(limitRestaurants)
            .get();
        if(response.docs.length > 0){
            result.startRestaurant = response.docs[response.docs.length - 1];
        }
        response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            result.restaurants.push(restaurant);
        })
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const getRestaurantReviewsAsync = async(id) => {
    const result = {statusResponse: true, error: null, reviews: [], };
    try {
        const response = await db
            .collection("reviews")
            //.orderBy("createAt", "desc")
            .where("idRestaurant", "==", id)
            .get();
        
        response.forEach((doc) => {
            const review = doc.data();
            review.id = doc.id;
            result.reviews.push(review);
        })
        
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const getIsFavoriteAsync = async(idRestaurant) =>{
    const result = {statusResponse: true, error: null, isFavorite: false, };
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .where("idRestaurant", "==", idRestaurant)
            .get();
            result.isFavorite = response.docs.length > 0;
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const removeIsFavoriteAsync = async(idRestaurant) =>{
    const result = {statusResponse: true, error: null, };
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .where("idRestaurant", "==", idRestaurant)
            .get();
            response.forEach(async(doc) => {
                const favoriteId = doc.id;
                await db.collection("favorites").doc(favoriteId).delete();
            });
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}