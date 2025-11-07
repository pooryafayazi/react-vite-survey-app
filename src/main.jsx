// src/main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ThankYou from './pages/ThankYou.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path="/" element={<App />} />
<Route path="/thanks" element={<ThankYou />} />
</Routes>
</BrowserRouter>
</React.StrictMode>
);