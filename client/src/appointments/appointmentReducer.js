/**
 * This reducer deals with all states related to appointments
 */
import * as actions from './appointmentActions';

const initialState = {
    appointments: []
}

const appointmentReducer = (state = initialState, action) => {
    switch (action.type){
        case actions.STORE_ALL_APPOINTMENTS : return storeAllAppointments(action.appointments, state);
        default: return state;
    }
}

const storeAllAppointments = (appointments, state) => {
    // const allUsers = users.reduce((map, appointment) => {
    //     map[user.id] = appointment;
    //     return map
    // }, {});
    return {
        ...state,
        appointments
    }
}

export default appointmentReducer;

