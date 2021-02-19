/**
 * A modal popup for creating or viewing/editing a Contact.
 * Properties:
 * props.contact (optional) an existing contact to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE},
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY},
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY},    
    { name: 'type',     label: 'Type',      type: fieldType.SELECT}, 
    { name: 'details',  label: 'Details',   type: fieldType.TEXT},
]

class Contact extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.positions, type: 'position', mappedAttribute: 'title'},
            {entityList: this.props.persons,   type: 'person',   mappedAttribute: 'name'}
        ])

        this.optionSets['type'] = [{label: 'Email', value: 'email'}, {label: 'Phone', value: 'phone'}]
     }

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        console.log("from server" + entity.when)

        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass='Contact' fieldDefs={fieldDefs} optionSets={this.optionSets} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

const mapStateToProps = state => {
    return {
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions
    }
}

export default withOptionSets(connect(mapStateToProps)(Contact));