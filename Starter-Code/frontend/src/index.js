import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google" 


import store from "../src/redux/reducers/store";
import { Provider } from "react-redux";

const CLIENT_ID="865825573679-ahgfngqpiffatl55u9c7bo32hogefb16.apps.googleusercontent.com"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
    </GoogleOAuthProvider>
  </Router>
);
