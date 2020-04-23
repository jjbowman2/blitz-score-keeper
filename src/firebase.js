import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA2vHAXcywHMbon17ksCiTA2LRF32BUsVw",
    authDomain: "blitz-score-keeper.firebaseapp.com",
    databaseURL: "https://blitz-score-keeper.firebaseio.com",
    projectId: "blitz-score-keeper",
    storageBucket: "blitz-score-keeper.appspot.com",
    messagingSenderId: "844323172701",
    appId: "1:844323172701:web:b266e09deab9fa547f38b4"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
    firebase.auth().signInWithRedirect(provider);
}