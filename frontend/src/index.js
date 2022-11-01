import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import Auth0ProviderCustomImpl from "./Auth0/Auth0ProviderCustomImpl";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Auth0ProviderCustomImpl>
      <App />
    </Auth0ProviderCustomImpl>
  </BrowserRouter>
);