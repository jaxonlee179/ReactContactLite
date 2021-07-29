/**
 * A modal popup for creating or viewing/editing a phone call encounter Encounter.
 * Note that Encounter entities for emails are created automatically on the server
 * when it receives the emails
 */
import React from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import buildOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE_TIME},
    { name: 'type',     label: 'Type',      type: fieldType.TEXT,           readOnly: true},
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY},
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY},    
    { name: 'details',  label: 'Details',   type: fieldType.TEXT_AREA}
]

/**
 * Generates an Encounter component
 * @param {object} entity: an existing company, or null to create a new one 
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} persons: all the Personentities
 * @param {array} positions: all the Position entities
 * @returns the component
 */
function Encounter({entity, closeForm, persons, positions }) {

    const optionSets = buildOptionSets([
        {entityList: positions, type: 'position', mappedAttribute: 'title'},
        {entityList: persons,   type: 'person',   mappedAttribute: 'name'}
    ]);

    let isNew;
    if (entity == null){
        isNew = true;
        entity = {}
    }

    // The encounter type field will not be displayed. It's value will be set
    // to 'phone' upon first saving
    const defs = fieldDefs.filter( fieldDef => fieldDef.name !== 'type')

    return <ResponsiveForm theEntity={entity} entityClass='Phone Encounter' fieldDefs={defs} optionSets={optionSets} closeForm={closeForm} isNew={isNew}/>
}

const mapStateToProps = state => {
    return {
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions
    }
}

export default connect(mapStateToProps)(Encounter);