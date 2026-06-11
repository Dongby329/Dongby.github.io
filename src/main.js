import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js?v=grainient-unified-4';

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
