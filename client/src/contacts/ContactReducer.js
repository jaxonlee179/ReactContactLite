/**
 * This reducer deals with all states related to contacts
 */
import * as actions from './ContactActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    contacts: [],
    contactsMap: undefined
}

const contactReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'contacts', 'contactsMap', action.contacts);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.contact, action.data.rowIndex, 'contacts', 'contactsMap');
        default: return state;
    }
}

export default contactReducer;

