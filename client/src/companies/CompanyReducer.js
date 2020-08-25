/**
 * This reducer deals with all states related to companies
 */
import * as actions from './companyActions';

const initialState = {
    companies: []
}

const companyReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_COMPANIES : return storeAllCompanies(action.companies, state);
        default: return state;
    }
}

const storeAllCompanies = (companies, state) => {
    return {
        ...state,
        companies
    }
}

export default companyReducer;

