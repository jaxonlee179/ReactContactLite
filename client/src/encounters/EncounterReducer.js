/**
 * This reducer deals with all states related to encounters
 */
import * as actions from './EncounterActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    encounters: [],
    encountersMap: undefined
}

const encounterReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'encounters', 'encountersMap', action.encounters);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.encounter, action.data.rowIndex, 'encounters', 'encountersMap');
        default: return state;
    }
}

export default encounterReducer;

