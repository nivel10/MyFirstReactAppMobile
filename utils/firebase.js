import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK6EZ4ZRPSJc4R8IJ6KauehKXYE5b83I8",
  authDomain: "myfirstreactappmobile.firebaseapp.com",
  databaseURL: "https://myfirstreactappmobile-default-rtdb.firebaseio.com",
  projectId: "myfirstreactappmobile",
  storageBucket: "myfirstreactappmobile.appspot.com",
  messagingSenderId: "6390273939",
  appId: "1:6390273939:web:44551d535d4939f59ffa66"
  };
  
  // Initialize Firebase
  export const  firebaseApp = firebase.initializeApp(firebaseConfig);