/**
 * This reducer deals with all states related to companies
 */
import * as actions from './CompanyActions';

const initialState = {
    companies: [],
    companiesMap: undefined
}

const companyReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(action.companies, state);
        case actions.SAVE_AND_STORE : return storeOne(action.data, state);
        default: return state;
    }
}

const storeAll = (companies, state) => {
    const newState = {...state}
    let companiesMap = state.companiesMap
    
    if (!companiesMap){
        // Companies have just been retrieved from server
        newState.companiesMap = companies.reduce((map, company) => {
            map[company._id] = company
            return map
        }, {})
    }
    newState.companies = companies;

    return newState
}

/**
 * Stores a new or modified company. The 
 * @param {*} company 
 * @param {*} state 
 */
const storeOne = ({company, rowIndex}, state) => {
    // Add or replace it in the map
    const companies = [...state.companies];
    if (rowIndex == null){
        companies.push(company)
    }
    else {    
        companies[rowIndex] = company
    }
    const companiesMap = {...state.companiesMap}
    companiesMap[company._id] = company;

    return {
        ...state,
        companies,
        companiesMap
    }
}

export default companyReducer;

