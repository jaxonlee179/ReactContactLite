/**
 * Actions associated with persons
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_PERSONS';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_PERSONS'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated Person to the server then dispatches to the store
 * @param {*} person 
 */
export const savePerson = ((person, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/persons', person)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {person: response.data} })
            });        
        }
        else {
            axios.put('/persons/' + person._id, person)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {person: response.data, rowIndex} })
            });        
        }    
    }
})

