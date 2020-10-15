/**
 * This reducer deals with all states related to appointments
 */
import * as actions from './AppointmentActions';
import { storeAll, storeOne } from '../utilities/reducerHelper';

const initialState = {
    appointments: [],
    appointmentsMap: undefined
}

const appointmentReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL : return storeAll(state, 'appointments', 'appointmentsMap', action.appointments);
        case actions.SAVE_AND_STORE : return storeOne(state, action.data.appointment, action.data.rowIndex, 'appointments', 'appointmentsMap');
        default: return state;
    }
}

export default appointmentReducer;

