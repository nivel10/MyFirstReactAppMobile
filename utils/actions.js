import {firebaseApp} from './firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export const isUserLogged = () =>{
    let isLoggerd = false;

    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLoggerd = true);
    })
    return isLoggerd;
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
}

export const createUserAsync = async (email, password) =>{
    const result = {statusResponse: true, error: null, };
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (ex){
            console.log(`${ex.code} - ${ex.message}`);
            result.statusResponse = false;
            result.error = ex.message;
        });
    } catch (ex) {
        console.log(ex);
        result.statusResponse = false;
        result.error = ex;
    }
    return result;
}

export const logoutUser = () => {
    firebase.auth().signOut();
}