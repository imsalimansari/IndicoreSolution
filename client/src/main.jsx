import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./theme.jsx";
import { warmUp } from "./api.js";
import "./styles.css";
warmUp();
createRoot(document.getElementById("root")).render(
  <BrowserRouter><ThemeProvider><App /></ThemeProvider></BrowserRouter>
);
