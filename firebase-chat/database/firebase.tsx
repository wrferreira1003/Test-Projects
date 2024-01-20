import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9HeQAA4VSBsvSTF1opxtMLsXzkEmUMIs",
  authDomain: "chat-teste-22565.firebaseapp.com",
  projectId: "chat-teste-22565",
  storageBucket: "chat-teste-22565.appspot.com",
  messagingSenderId: "236198218026",
  appId: "1:236198218026:web:8caeb636abdbcf9940f653",
  measurementId: "G-CN1ZNS2ZTL"
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
