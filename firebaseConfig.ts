// / Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtjMdqoVfe33zf6IyzvJzqVtPC_2E1pso",
  authDomain: "cargotracker-7fd00.firebaseapp.com",
  projectId: "cargotracker-7fd00",
  storageBucket: "cargotracker-7fd00.firebasestorage.app",
  messagingSenderId: "101210758826",
  appId: "1:101210758826:web:3739e56cded77c7ac7fad3",
  measurementId: "G-HHKTJSFRBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };