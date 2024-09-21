import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";

const firebaseConfig = {
  apiKey: "AIzaSyALWs1ujWO647TFEsPfKGQXaumTMQcDoGo",
  authDomain: "switter-d1178.firebaseapp.com",
  projectId: "switter-d1178",
  storageBucket: "switter-d1178.appspot.com",
  messagingSenderId: "191831833601",
  appId: "1:191831833601:web:09f3d80054cf1583bc1400",
  measurementId: "G-R55CNR6V5H",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
