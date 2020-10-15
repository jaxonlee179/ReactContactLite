/**
 * This reducer deals with all states related to companies
 */
import * as actions from './CompanyActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    companies: [],
    companiesMap: undefined
}

const companyReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'companies', 'companiesMap', action.companies);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.company, action.data.rowIndex, 'companies', 'companiesMap');
        default: return state;
    }
}

export default companyReducer;

