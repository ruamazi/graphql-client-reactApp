import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import GridBG from "./components/GridBG.jsx";

const backendbaseUri = import.meta.env.VITE_API_URI;

const client = new ApolloClient({
  uri: backendbaseUri,
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBG>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBG>
    </BrowserRouter>
  </React.StrictMode>
);
