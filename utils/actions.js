import {firebaseApp} from './firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FireSQL } from 'firesql';

import { fileToBlobAsync, getResponse } from '../utils/helpers'
import { includes, map } from 'lodash';
import { Alert } from 'react-native';

const db = firebase.firestore(firebaseApp);
const fireSQL = new FireSQL(firebase.firestore(), {includeId: "id", });

export const isUserLogged = () =>{
    /*let isLogged = false;

    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLogged = true);
        //user !== null ? isLogged = true : isLogged = false;
        //console.log(`onAuthStateChanged: ${user}`);
    })
    return isLogged;*/

    return (getCurrentUser() !== null);
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
}

export const createUserAsync = async (email, password) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (ex){
            result.statusResponse = false;
            result.error = ex.message;
        });
    } catch (ex) {
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

export const addDocumentWithIdAsync = async(collection, data, doc) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await db.collection(collection).doc(doc).set(data);
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

export const getFavoritesAsync = async () => {
    const result = {statusResponse: true, error: null, result: null};
    try {
        let favorites = [];
        let restaurantsId = [];

        const response = await db.collection('favorites')
        .where("idUser", "==", getCurrentUser().uid)
        .get();

        // response.forEach(async (doc) => {
        //     const favorite = doc.data();
        //     restaurantsId.push(favorite.idRestaurant);
        // });

        //#region Old code
        //await Promise.all(
            // map(restaurantsId, async(restaurantId) => {
            //     const resultRestaurant = await getDocumentByIdAsync('restaurants', restaurantId);
            //     if(resultRestaurant.statusResponse){
            //         favorites.push(resultRestaurant.document);
            //     }
            //     else {
            //         //console.log(resultRestaurant);
            //     }
            // })
        //)
        //#endregion Old code

        // for (const restaurantId of restaurantsId){
        //     const resultRestaurant = await getDocumentByIdAsync('restaurants', restaurantId);
        //     if(resultRestaurant.statusResponse){
        //         favorites.push(resultRestaurant.document);
        //     }
        //     else {
        //         result.error = resultRestaurant.error;
        //         return;
        //     }
        // }

        await Promise.all(
            map(response.docs, async (doc) =>{
                const favorite = doc.data();
                const responseRestaurant = await getDocumentByIdAsync('restaurants', favorite.idRestaurant);
                if(responseRestaurant){
                    favorites.push(responseRestaurant.document);
                } else {
                    result.error = responseRestaurant.error;
                    return;
                }
            })
        )

        result.result = favorites;
    } catch (ex) {
        result.statusResponse = false;
        result.error = `${ex.message}`;
    }
    return result;
}

export const getTopRestaurantsAsync = async (limit) => {
    const result = {statusResponse: true, result: null, error: null, };
    try {
        const restaurants = [];
        const response = await db.collection('restaurants')
        .orderBy("rating", "desc")
        .limit(limit)
        .get();

        response.forEach((doc) =>{
            const restaurant = doc.data();
            restaurant.id = doc.id;
            restaurants.push(restaurant);
        });
        result.result = restaurants;
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
} 

export const searchRestaurantsAsync = async (criteria) => {
    const result = {statusResponse: true, result: null, error: null, };
    try {
        const restaurants = await fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`);
        result.result = restaurants;
    } catch (ex) {
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
} 

export const getDocumentByConditionalAsync = async (collection, field, conditional, value) => {
    let response = getResponse();
    try {
        let query = `SELECT * FROM ${collection} `;
        query += `WHERE ${field} ${conditional} '${value}'`;

        const result = await fireSQL.query(query);
        response.result = result;
    } catch (ex) {
        response.isSuccess = false;
        response.msgType = -1;
        response.msgText = `${ex.code} - ${ex.message}`;
    }
    return response;
} 

export const getDocumentByConditionalsAsync = async (collection, conditionals, ordersBy, limit) =>{
    const result =  {isSuccess: true, isWarning: false, msgType: 0, msgText: null, result: null, };
    try{
        let firebaseQuery = db.collection(collection);

        // Conditionals
        map(conditionals, (conditionl, index) => {
            firebaseQuery = firebaseQuery.where(conditionl.field, conditionl.operator, conditionl.value);
        });

        // Order by
        map(ordersBy, (orderBy, index) =>{
            if(orderBy.field !== '' && orderBy.value !== ''){
                firebaseQuery = firebaseQuery.orderBy(orderBy.field, orderBy.value);
            } else {
                firebaseQuery = firebaseQuery.orderBy(orderBy.field);
            }
        });

        // Limits
        if(limit > 0){
            firebaseQuery = firebaseQuery.limit(limit);
        }

        const data = await firebaseQuery.get();
        result.result = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch(ex){
        result.isSuccess = false;
        result.msgType = -1;
        result.msgText = ex.message;
    }
    return result;
}

export const getUsersFavotiteAsync = async (restaurantId) => {
    let response = getResponse();
    try {
        let users = [];
        const result = await db.collection('favorites').where('idRestaurant', '==', restaurantId).get();

        await Promise.all(
            map(result.docs, async (doc) => {
                const favorite = doc.data();

                const resultUser = await getDocumentByConditionalAsync('notificationsToken', 'idUser', '=', favorite.idUser);

                if(resultUser.isSuccess){
                    if(resultUser.result.length > 0){
                        users.push(resultUser.result[0]);
                    }
                }
            })
        );
        response.result = users;
    } catch (ex) {
        response.isSuccess = false;
        response.msgType = -1;
        response.msgText = `${ex.code} - ${ex.message}`;
    }
    return response;
} 

export const sendEmailResetPassword = async(email) => {
    let response = getResponse();
  try{
      //const result = await firebase.auth().sendPasswordResetEmail(email);
      await firebase.auth().sendPasswordResetEmail(email);
  }  catch(ex) {
      switch(ex.code){
        case 'auth/user-not-found':
            response.msgType = 1;
            response.isWarning = true;
            response.msgText = `This email is not associated with any user`;
            break;
        default:
            response.msgType = -1;
            response.isSuccess = false;
            response.msgText = `${ex.code} - ${ex.message}`;
            break;
      }
  }
  return response;
} 