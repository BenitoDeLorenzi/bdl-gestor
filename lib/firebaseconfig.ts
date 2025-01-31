import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgkY7mwaKZBCRA4TEO1TFO0R8HIPlLfCE",
  authDomain: "bdl-gestor-22c13.firebaseapp.com",
  projectId: "bdl-gestor-22c13",
  storageBucket: "bdl-gestor-22c13.appspot.com",
  messagingSenderId: "613896675060",
  appId: "1:613896675060:web:4a5619e7027a71af4908a1",
  measurementId: "G-MWH5GCXQEM",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage };
