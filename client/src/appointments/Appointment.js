/**
 * A modal popup for creating, editing or viewing an Appointment.
 */
import React from 'react'
import ResponsiveForm from '../components/ResponsiveForm';
import { fieldType, fieldWidth } from '../components/Constants';
import { connect } from 'react-redux'
import buildEntityOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE_TIME,       displayWidth: fieldWidth.NORMAL },
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY,   displayWidth: fieldWidth.WIDE },
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY,   displayWidth: fieldWidth.NORMAL },
    { name: 'company',  label: 'Company',   type: fieldType.SELECT_ENTITY,   displayWidth: fieldWidth.NORMAL },
]

/**
 * Generates an Appointment component
 * @param {object} entity: an existing company, or null to create a new one
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} companies: all the Company entities
 * @param {array} persons: all the Personentities
 * @param {array} positions: all the Position entities
 * @returns the component
 */
function Appointment({ entity, closeForm, companies, persons, positions }) {
    const optionSets = buildEntityOptionSets([
        { entityList: companies, type: 'company', mappedAttribute: 'name' },
        { entityList: positions, type: 'position', mappedAttribute: 'title' },
        { entityList: persons, type: 'person', mappedAttribute: 'name' },
    ])

    let isNew
    if (entity == null) {
        isNew = true
        entity = {}
    }
    return (
        <ResponsiveForm
            theEntity={entity}
            entityClass="Appointment"
            fieldDefs={fieldDefs}
            optionSets={optionSets}
            closeForm={closeForm}
            isNew={isNew}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        companies: state.companyReducer.companies,
        persons: state.personReducer.persons,
        positions: state.positionReducer.positions,
    }
}

export default connect(mapStateToProps)(Appointment)
