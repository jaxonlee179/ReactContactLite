/**
 * Actions associated with encounters
 */
import axios from 'axios';

 /******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_CONTACTS';
export const STORE_ONE = 'STORE_ONE_CONTACT'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated encounter to the server then dispatches to the store
 * @param {*} encounter 
 */
export const saveEncounter = ((encounter, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/encounters', encounter)
            .then((response) => {
                dispatch({ type: STORE_ONE, data: {encounter: response.data} })
            });        
        }
        else {
            axios.put('/encounters/' + encounter._id, encounter)
            .then((response) => {
                dispatch({ type: STORE_ONE, data: {encounter: response.data, rowIndex} })
            });        
        }    
    }
})
