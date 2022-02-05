/**
 * This reducer deals with all states related to emails
 */
import * as actions from './EmailActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    emails: [],
    emailsMap: undefined
}

const emailReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'emails', 'emailsMap', action.emails);
        case actions.STORE_ONE : return storeOne(state, action.data.email, action.data.rowIndex, 'emails', 'emailsMap');
        default: return state;
    }
}

export default emailReducer;

