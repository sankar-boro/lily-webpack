import React from "react";
import { createRoot } from 'react-dom/client';
// import { App } from "./App";
import { StylesModal } from "./StylesModal";
import { BrowserRouter } from "react-router-dom";

import "./index.css"

const container: any = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <StylesModal />
        </BrowserRouter>
    </React.StrictMode>
);