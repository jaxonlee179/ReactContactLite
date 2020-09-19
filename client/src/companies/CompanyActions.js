/**
 * Actions associated with companies
 */
import axios from 'axios';

/******* Synchronous actions *********/
// Store all companies retrieved from server
export const STORE_ALL = 'STORE_ALL';   

// Send and store a newly created company, or an edited one
export const SAVE_AND_STORE = 'SAVE_AND_STORE'; 

/******* Asynchronous actions *********/
/**
 * Sends a new or updated company to the server then dispatches to the store
 * @param {*} company 
 */
export const saveCompany = ((company, rowIndex) => {
    return dispatch => {
        if (rowIndex === null){
            axios.post('/companies', company)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {company: response.data} })
            });        
        }
        else {
            axios.put('/companies/' + company._id, company)
            .then((response) => {
                dispatch({ type: SAVE_AND_STORE, data: {company: response.data, rowIndex} })
            });        
        }    
    }
})
