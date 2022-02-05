/**
 * A modal popup for creating or viewing/editing a phone call encounter Encounter.
 * Note that Encounter entities for emails are created automatically on the server
 * when it receives the emails
 */
import React from 'react'
import ResponsiveForm from '../components/ResponsiveForm';
import { fieldType, fieldWidth } from '../components/Constants';
import { connect } from 'react-redux'
import buildEntityOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE_TIME,      displayWidth: fieldWidth.NORMAL },
    { name: 'type',     label: 'Type',      type: fieldType.SELECT,         displayWidth: fieldWidth.NARROW },
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY,  displayWidth: fieldWidth.NORMAL },
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY,  displayWidth: fieldWidth.NORMAL },
    { name: 'details',  label: 'Details',   type: fieldType.TEXT_AREA,      displayWidth: fieldWidth.WIDE }, 
    { name: 'hide',     label: 'Hide',      type: fieldType.BOOLEAN_HIDDEN, displayWidth: fieldWidth.NARROW}
]

/**
 * Generates an Encounter component
 * @param {object} entity: an existing company, or null to create a new one
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} persons: all the Personentities
 * @param {array} positions: all the Position entities
 * @returns the component
 */
function Encounter({ entity, closeForm, persons, positions }) {
    const optionSets = buildEntityOptionSets([
        { entityList: positions, type: 'position', mappedAttribute: 'title' },
        { entityList: persons, type: 'person', mappedAttribute: 'name' },
    ])
    optionSets['type'] = [
        {label: 'Phone', value: 'phone'},
        {label: 'LinkedIn', value: 'linkedIn'}
    ]

    let isNew
    if (entity == null) {
        isNew = true
        entity = {}
    }

    return (
        <ResponsiveForm
            theEntity={entity}
            entityClass="Encounter"
            fieldDefs={fieldDefs}
            optionSets={optionSets}
            closeForm={closeForm}
            isNew={isNew}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions,
    }
}

export default connect(mapStateToProps)(Encounter)
