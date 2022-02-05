/**
 * Actions associated with emails
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_EMAILS';
export const STORE_ONE = 'STORE_ONE_EMAIL';

/******* Asynchronous actions *********/
/**
 * Sends an new updated email entity to the server then dispatches to the store
 * @param {*} email 
 */
export const saveEmail = ((email, rowIndex) => {
    return dispatch => {
        axios.put('/emails/' + email._id, email)
        .then((response) => {
            dispatch({ type: STORE_ONE, data: {email: response.data, rowIndex} })
        });        
    }    
})