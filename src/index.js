import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { StoreProvider } from 'easy-peasy';
import store from './store/index.ts'

const storedState = localStorage.getItem('store');
const initialState = storedState ? JSON.parse(storedState) : {};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider store={store} initialState={initialState}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);