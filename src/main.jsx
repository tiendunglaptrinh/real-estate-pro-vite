import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router/router.jsx";
import GlobalStyles from '@components/GlobalStyles'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>
);