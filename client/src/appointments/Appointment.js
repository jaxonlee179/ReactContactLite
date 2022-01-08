/**
 * A modal popup for creating, editing or viewing an Appointment.
 */
import React from 'react'
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm'
import { connect } from 'react-redux'
import buildEntityOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'when',     label: 'When',      type: fieldType.DATE_TIME },
    { name: 'position', label: 'Position',  type: fieldType.SELECT_ENTITY },
    { name: 'person',   label: 'Person',    type: fieldType.SELECT_ENTITY },
    { name: 'company',  label: 'Company',   type: fieldType.SELECT_ENTITY },
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
    const entityOptionSets = buildEntityOptionSets([
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
            entityOptionSets={entityOptionSets}
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
