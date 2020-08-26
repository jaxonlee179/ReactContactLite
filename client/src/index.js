import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import personReducer from './persons/PersonReducer';
import companyReducer from './companies/CompanyReducer';
import contactReducer from './contacts/ContactReducer';
import positionReducer from './positions/PositionReducer';
import appointmentReducer from './appointments/AppointmentReducer';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import thunk from 'redux-thunk';

// Create the Redux store
const rootReducer = combineReducers({
    personReducer,
    companyReducer,
    contactReducer,
    positionReducer,
    appointmentReducer,
});
  
// Enable Redux devtools Chrome extension, and add thunk middleware (support for asynchronous 
// actions,) per https://github.com/zalmoxisus/redux-devtools-extension#usage
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

axios.defaults.headers.post['Content-Type'] = 'application/json'; // Necessary ?

let baseURI = document.baseURI;
if (!baseURI) {
    // For IE
    baseURI = window.location.href;
}

// baseURI = baseURI.indexOf('#') > 0 ? baseURI.substring(0, baseURI.indexOf('#')) : baseURI;
// axios.defaults.baseURL = baseURI
// console.log(baseURI);
// if (baseURI === "http://localhost:3000/"){
//   // Client loaded from VSCode local server 
//   axios.defaults.baseURL ="http://localhost:5000/"; 
// }
// else {
//   // Client loaded from local or remote App Engine server
//   axios.defaults.baseURL =  baseURI;
// }

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
