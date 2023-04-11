import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBjfbRvbzDGPc_dv1FzAjxywznmpyIktkY",
    authDomain: "dropsmart-db791.firebaseapp.com",
    projectId: "dropsmart-db791",
    storageBucket: "dropsmart-db791.appspot.com",
    messagingSenderId: "1096316395198",
    appId: "1:1096316395198:web:01815c5ee262518ace08ef",
    measurementId: "G-38N7VCXCH0",
    databaseURL: 'https://dropsmart-db791-default-rtdb.asia-southeast1.firebasedatabase.app'
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const db = getDatabase(app)

export {db, auth, database};
