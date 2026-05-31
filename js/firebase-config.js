import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getAuth 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
  getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBURpVdKViUgiG-XEKWajQRWwcXfX91Xc",
  authDomain: "glps-mulkadu-admin.firebaseapp.com",
  projectId: "glps-mulkadu-admin",
  storageBucket: "glps-mulkadu-admin.appspot.com",
  messagingSenderId: "420675034876",
  appId: "1:420675034876:web:3ba13ffdec004df6ef8179",
  measurementId: "G-J1YYHFCESY"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };