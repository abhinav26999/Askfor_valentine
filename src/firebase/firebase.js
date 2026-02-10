// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCilrz0KbDzh3-7ru5T7ZGTZM8kZZQ_ms0",
    authDomain: "ask-for-valentine.firebaseapp.com",
    projectId: "ask-for-valentine",
    storageBucket: "ask-for-valentine.firebasestorage.app",
    messagingSenderId: "724715042005",
    appId: "1:724715042005:web:a24f52223d34a7583b1e5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);