import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import store from "./store/store.js";
import config from "./config.js";
import "./index.css";

const AppProviders = ({ children }) => {
  const content = (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </HelmetProvider>
  );

  if (!config.googleClientId) return content;
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <AppProviders>
      <App />
    </AppProviders>
  </ErrorBoundary>
);
