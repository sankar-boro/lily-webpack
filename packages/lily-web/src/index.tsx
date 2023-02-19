import React from "react";
import { createRoot } from 'react-dom/client';
// import { App } from "./App";
import { SettingsModal } from "./SettingsModal";
import { BrowserRouter } from "react-router-dom";

import "./index.css"

const container: any = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <SettingsModal />
        </BrowserRouter>
    </React.StrictMode>
);