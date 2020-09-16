/**
 * Actions associated with companies
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_ALL_COMPANIES = 'STORE_ALL_COMPANIES';
export const SAVE_COMPANY = 'SAVE_COMPANY';

/******* Asynchronous actions *********/

/**
 * Sends a new or updated company to the server then dispatches to the store
 * @param {*} company 
 */
export const saveCompany = ((company, isNew) => {
    return dispatch => {
        if (isNew){
            axios.post('/companies', company)
            .then((response) => {
                dispatch({ type: SAVE_COMPANY, company: response.data})
            });        
        }
        else {
            axios.put('/companies/' + company._id, company)
            .then((response) => {
                dispatch({ type: SAVE_COMPANY, company: response.data})
            });        
        }    
    }
})
