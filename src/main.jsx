import React from "react";
import ReactDom from "react-dom";
import App from "./App.jsx";

ReactDom.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);