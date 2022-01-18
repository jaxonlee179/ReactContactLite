import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Appointment, { fieldDefs } from './Appointment';
import * as actions from './AppointmentActions';

/**
 * Displays the Appointment list
 */
function AppointmentList () {

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ appointment,    setAppointment ]    = useState(null); 

    const dispatch = useDispatch();
    
    const appointments = useSelector(state => state.appointmentReducer.appointments);
    const companiesMap = useSelector(state => state.companyReducer.companiesMap);
    const positionsMap = useSelector(state => state.positionReducer.positionsMap);
    const personsMap = useSelector(state => state.personReducer.personsMap);

    function afterSort (sorted, column, ascending) {
        dispatch( { type: actions.STORE_ALL, appointments: sorted})
        setColumn(column);
        setAscending(ascending);        
    }

    /**
     * Displays the popup to create a new appointment
     */
     function createNew(){
        setSelectedRow(null);
        setDisplayForm(true);
        setAppointment(null);
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} appointment the full MongoDB appointment object retrieved from the server
     */
     function select(e, selectedRow, appointment){
        setSelectedRow(selectedRow);
        setDisplayForm(true);
        setAppointment(appointment);
    }

    function closeForm(appointment){
        setDisplayForm(false);
        if (appointment) {
            dispatch(actions.saveAppointment(appointment, selectedRow))
        }    
    }

    const sortProps = {
        afterSort,
        column,
        ascending
    }
    const entityMaps = {
        'company': { entities: companiesMap, displayField: 'name' },
        'person': { entities: personsMap, displayField: 'name' },
        'position': { entities: positionsMap, displayField: 'title' }
    }
    const colors = { headerBg: '#2c3e50' } // Set to bootstrap-<them>.css body color
    return (
        <div>
            <ListHeaderFooter 
                fieldDefs={fieldDefs}
                header='true' 
                name='Appointments' 
                label='New Appointment' 
                createNew={createNew} />
            <ResponsiveTable
                entities={appointments}
                entityMaps={entityMaps}
                fieldDefs={fieldDefs}
                colors={colors}
                sortProps={sortProps}
                onRowClick={select} />
            {displayForm ? <Appointment entity={appointment} closeForm={closeForm}></Appointment> : ''}
        </div>
    )
}

export default AppointmentList;
