// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-aOGUCb0__J5hhi3oA0Sr1E0SACr_1YE",
  authDomain: "react-examen-31c03.firebaseapp.com",
  projectId: "react-examen-31c03",
  storageBucket: "react-examen-31c03.firebasestorage.app",
  messagingSenderId: "148466443904",
  appId: "1:148466443904:web:e17755511074547d92e865",
  measurementId: "G-PXE4SGSJ27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);