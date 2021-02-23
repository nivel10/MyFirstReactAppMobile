import {firebaseApp} from './firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export const isUserLogged = () =>{
    let isLoggerd = false;

    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLoggerd = true);
    })
};

export const getCurrentUser = () => {
    return firebase.auth().currentUser;
}