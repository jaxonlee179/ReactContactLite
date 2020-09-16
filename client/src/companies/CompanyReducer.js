/**
 * This reducer deals with all states related to companies
 */
import * as actions from './CompanyActions';

const initialState = {
    companies: [],
    companiesMap: {}
}

const companyReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_COMPANIES : return storeAll(action.companies, state);
        case actions.SAVE_COMPANY : return saveOne(action.company, state);
        default: return state;
    }
}

const storeAll = (companies, state) => {
    const companiesMap = companies.reduce((map, company) => {
        map[company._id] = company
        return map
    }, {})
    return {
        ...state,
        companies,
        companiesMap
    }
}

const saveOne = (company, state) => {
    const companiesMap = {...state.companiesMap}
    companiesMap[company._id] = company;

    const ids = Object.keys(companiesMap);
    const companies = []
    ids.forEach(id => {
        companies.push(companiesMap[id])
    })
    return {
        ...state,
        companies,
        companiesMap
    }
}

export default companyReducer;

