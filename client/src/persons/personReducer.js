/**
 * This reducer deals with all states related to persons
 */
import * as actions from './personActions';

const initialState = {
    persons: []
}

const personReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_PERSONS : return storeAllPersons(action.persons, state);
        default: return state;
    }
}

const storeAllPersons = (persons, state) => {
    return {
        ...state,
        persons
    }
}

export default personReducer;

