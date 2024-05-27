// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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
const auth = getAuth(firebaseApp);

const fetchUserRole = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      return docSnap.data().role;
  } else {
      return 'user'; // Default role
  }
};

const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), { email: email, role: 'user' });
  return userCredential.user;
};

export { db, auth, firebaseApp, signInWithEmailAndPassword, registerUser, fetchUserRole };
