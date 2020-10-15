/**
 * A modal popup for creating or viewing/editing an Appointment.
 * Properties:
 * props.appointment (optional) an existing appointment to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'when',     label: 'When',    type: fieldType.DATE},
    { name: 'position', label: 'Position',type: fieldType.SELECT},
    { name: 'person',   label: 'Person',  type: fieldType.SELECT},    
    { name: 'company',  label: 'Company', type: fieldType.SELECT}    
]

class Appointment extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.companies, type: 'company'},
            {entityList: this.props.positions, type: 'person'},
            {entityList: this.props.persons,   type: 'person'}
        ])
    }

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        console.log("from server" + entity.when)

        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass='Appointment' fieldDefs={fieldDefs} optionSets={this.optionSets} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies,
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions
    }
}

export default withOptionSets(connect(mapStateToProps)(Appointment));