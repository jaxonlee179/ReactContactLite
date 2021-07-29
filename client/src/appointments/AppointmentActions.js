/**
 * Actions associated with appointments
 */
import axios from 'axios';

 /******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_APPOINTMENTS';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_APPOINTMENTS'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated appointment to the server then dispatches to the store
 * @param {*} appointment 
 */
export const saveAppointment = ((appointment, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/appointments', appointment)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {appointment: response.data} })
            });        
        }
        else {
            axios.put('/appointments/' + appointment._id, appointment)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {appointment: response.data, rowIndex} })
            });        
        }    
    }
})
