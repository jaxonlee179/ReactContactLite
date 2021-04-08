/**
 * A modal popup for creating or viewing/editing a phone call encounter Encounter.
 * Note that Encounter entities for emails are created automatically on the server
 * when it receives the emails
 * Properties:
 * props.encounter (optional) an existing encounter to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE_TIME},
    { name: 'type',     label: 'Type',      type: fieldType.TEXT,           readOnly: true},
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY},
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY},    
    { name: 'details',  label: 'Details',   type: fieldType.TEXT_AREA}
]

class Encounter extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.positions, type: 'position', mappedAttribute: 'title'},
            {entityList: this.props.persons,   type: 'person',   mappedAttribute: 'name'}
        ])

     }

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        console.log("from server" + entity.when)

        const isNew = this.props.entity == null
        // The encounter type field will not be displayed. It's value will be set
        // to 'phone' upon first saving
        const defs = fieldDefs.filter( fieldDef => fieldDef.name !== 'type')

        return (
            <ResponsiveForm entity={entity} entityClass='Phone Encounter' fieldDefs={defs} optionSets={this.optionSets} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

const mapStateToProps = state => {
    return {
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions
    }
}

export default withOptionSets(connect(mapStateToProps)(Encounter));