/**
 * This reducer deals with all states related to persons
 */
import * as actions from './PersonActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    persons: [],
    personsMap: undefined
}

const personReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'persons', 'personsMap', action.persons);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.person, action.data.rowIndex, 'persons', 'personsMap');
        default: return state;
    }
}

export default personReducer;

