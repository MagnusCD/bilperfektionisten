// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMAupxCuue4Myd9pxAofcSbiPhmT_Um18",
  authDomain: "bilperfektionisten-89726.firebaseapp.com",
  projectId: "bilperfektionisten-89726",
  storageBucket: "bilperfektionisten-89726.appspot.com",
  messagingSenderId: "1092022360640",
  appId: "1:1092022360640:web:9f0341b288247a23d81da5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db, firebaseApp };