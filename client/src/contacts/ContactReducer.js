/**
 * This reducer deals with all states related to contacts
 */
import * as actions from './ContactActions';

const initialState = {
    contacts: []
}

const contactReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_CONTACTS : return storeAllContacts(action.contacts, state);
        default: return state;
    }
}

const storeAllContacts = (contacts, state) => {
    return {
        ...state,
        contacts
    }
}

export default contactReducer;

