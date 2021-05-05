/**
 * A modal popup for creating, editing or viewing an Appointment.
 * Properties:
 * {object} entity: the Appointment entity, empty or populated
 * {array} companies: all the Company entities
 * {array} positions: all the Position entities
 * {array} persons: all the Person entities
 * {function} buildOptionSets: 
 * {function} closeForm: handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'when',     label: 'When',    type: fieldType.DATE_TIME},
    { name: 'position', label: 'Position',type: fieldType.SELECT_ENTITY},
    { name: 'person',   label: 'Person',  type: fieldType.SELECT_ENTITY},    
    { name: 'company',  label: 'Company', type: fieldType.SELECT_ENTITY}    
]

class Appointment extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.companies, type: 'company',  mappedAttribute: 'name'},
            {entityList: this.props.positions, type: 'position', mappedAttribute: 'title'},
            {entityList: this.props.persons,   type: 'person',   mappedAttribute: 'name'}
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