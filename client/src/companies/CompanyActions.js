/**
 * Actions associated with companies
 */
import axios from 'axios';

/******* Synchronous actions *********/
export const STORE_ALL = 'STORE_ALL_COMPANIES';
export const SAVE_AND_STORE = 'SAVE_AND_STORE_COMPANIES'; 

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
