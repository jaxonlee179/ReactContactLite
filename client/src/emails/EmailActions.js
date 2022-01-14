/**
 * Actions associated with emails
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_EMAILS';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_EMAILS'; 

/******* Asynchronous actions *********/
/**
 * Sends an new updated email entity to the server then dispatches to the store
 * @param {*} email 
 */
export const saveEmail = ((email, rowIndex) => {
    return dispatch => {
        axios.put('/emails/' + email._id, email)
        .then((response) => {
            dispatch({ type: SAVE_AND_STORE, data: {email: response.data, rowIndex} })
        });        
    }    
})