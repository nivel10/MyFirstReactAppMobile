import {firebaseApp} from './firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

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

export const loginUserAsync = async (email, password) => {
    const result = {statusResponse: true, error: null};
    try{
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (ex) {
            console.log(`${ex.code} - ${ex.message}`);
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