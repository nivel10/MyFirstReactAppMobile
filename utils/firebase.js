import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCBsBOwrBAxr1ZQGwaSLDSMgc6QyAlTF0A",
    authDomain: "chej-restaurants.firebaseapp.com",
    projectId: "chej-restaurants",
    storageBucket: "chej-restaurants.appspot.com",
    messagingSenderId: "992880064691",
    appId: "1:992880064691:web:bf54fb3651a6e9f8d1d8c6",
    measurementId: "G-0W9SYZSXQC"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();