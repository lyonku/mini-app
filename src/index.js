import React, { createContext } from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import "./index.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/remote-config";
import "firebase/compat/auth";

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA99klbFRUP1LvEKuQPIx5qRt0ELevCFro",
  authDomain: "loans-vk-app.firebaseapp.com",
  projectId: "loans-vk-app",
  storageBucket: "loans-vk-app.appspot.com",
  messagingSenderId: "476541682070",
  appId: "1:476541682070:web:c583ba86965ca3dd375db7",
  measurementId: "G-NP1S37ZLYJ",
});

export const Context = createContext(null);

const firestore = firebase.firestore();
const remoteConfig = firebase.remoteConfig();
const auth = firebase.auth();
remoteConfig.settings.minimumFetchIntervalMillis = 48000;

firebase
  .auth()
  .signInAnonymously()
  .then(() => {})
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <Context.Provider
    value={{
      firebase,
      firestore,
      remoteConfig,
      auth,
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
