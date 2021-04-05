/**
 * This reducer deals with all states related to emails
 */
import * as actions from './EmailActions';
import { storeAll } from '../utilities/reducerHelper';

const initialState = {
    emails: [],
    emailsMap: undefined
}

const emailReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'emails', 'emailsMap', action.emails);
        default: return state;
    }
}

export default emailReducer;

