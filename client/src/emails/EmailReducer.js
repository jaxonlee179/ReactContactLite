/**
 * This reducer deals with all states related to emails
 */
import * as actions from './EmailActions';

const initialState = {
    emails: [],
}

const emailReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return action.emails;
        default: return state;
    }
}

export default emailReducer;

