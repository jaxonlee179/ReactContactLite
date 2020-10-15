/**
 * Actions associated with contacts
 */
import axios from 'axios';

 /******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_CONTACTS';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_CONTACTS'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated contact to the server then dispatches to the store
 * @param {*} contact 
 */
export const saveAppointment = ((contact, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/contacts', contact)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {contact: response.data} })
            });        
        }
        else {
            axios.put('/contacts/' + contact._id, contact)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {contact: response.data, rowIndex} })
            });        
        }    
    }
})
