/**
 * This reducer deals with all states related to positions
 */
import * as actions from './positionActions';

const initialState = {
    positions: []
}

const positionReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_POSITIONS : return storeAllPositions(action.positions, state);
        default: return state;
    }
}

const storeAllPositions = (positions, state) => {
    return {
        ...state,
        positions
    }
}

export default positionReducer;

