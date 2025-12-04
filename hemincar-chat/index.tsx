import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Define a unique ID for the widget container to avoid conflicts in WordPress
const WIDGET_ROOT_ID = 'hemincar-ai-widget-root';

// Function to get or create the root element
const getOrCreateRoot = () => {
  let rootElement = document.getElementById(WIDGET_ROOT_ID);
  
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = WIDGET_ROOT_ID;
    // Ensure it doesn't interfere with page layout, but allows the fixed children to show
    rootElement.style.position = 'absolute';
    rootElement.style.top = '0';
    rootElement.style.left = '0';
    rootElement.style.width = '0';
    rootElement.style.height = '0';
    rootElement.style.zIndex = '99999'; 
    document.body.appendChild(rootElement);
  }
  
  return rootElement;
};

const rootElement = getOrCreateRoot();
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);