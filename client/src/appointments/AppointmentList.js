import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Appointment, { fieldDefs } from './Appointment';
import * as actions from './AppointmentActions';

class AppointmentList  extends Component {
    state = {}

    constructor (props){
        super(props);
 
        this.state = {
            column: undefined,     
            ascending: undefined,
            displayForm: false
        }
        this.select= this.select.bind(this);
        this.createNew= this.createNew.bind(this);
        this.closeForm= this.closeForm.bind(this);
    }

    afterSort = (sorted, column, ascending) => {
        this.props.storeAll(sorted)        
        this.setState( {
            ...this.state,
            column,
            ascending
        })
    }
    /**
     * Displays the popup to create a new appointment
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            appointment: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} appointment the full MongoDB appointment object retrieved from the server
     */
    select(e, selectedRow, appointment){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            appointment
        })
    }

    closeForm(appointment){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (appointment) {
            this.props.saveAppointment(appointment, this.state.selectedRow)
        }    
    }

    render() {

        const sortProps = {
            afterSort: this.afterSort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        return (
            <div>
                <ListHeaderFooter header='true' name='Appointments' label='New Appointment' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.appointments}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}/>
                {this.state.displayForm ? <Appointment entity={this.state.appointment} closeForm={this.closeForm}></Appointment> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        appointments: state.appointmentReducer.appointments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAppointment: (appointment, selectedRow) => dispatch(actions.saveAppointment(appointment, selectedRow)),
        storeAll: (appointments) => dispatch( { type: actions.STORE_ALL, appointments})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentList);
