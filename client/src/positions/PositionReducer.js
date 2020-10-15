/**
 * This reducer deals with all states related to positions
 */
import * as actions from './PositionActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    positions: [],
    positionsMap: undefined
}

const positionReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'positions', 'positionsMap', action.positions);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.position, action.data.rowIndex, 'positions', 'positionsMap');
        default: return state;
    }
}

export default positionReducer;

