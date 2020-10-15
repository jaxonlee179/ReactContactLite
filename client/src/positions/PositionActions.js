/**
 * Actions associated with positions
 */
import axios from 'axios';

 /******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_POSITIONS';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_POSITIONS'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated position to the server then dispatches to the store
 * @param {*} position 
 */
export const saveAppointment = ((position, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/positions', position)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {position: response.data} })
            });        
        }
        else {
            axios.put('/positions/' + position._id, position)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {position: response.data, rowIndex} })
            });        
        }    
    }
})
