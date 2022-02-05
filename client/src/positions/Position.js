/**
 * A modal popup for creating, editing or viewing a Position.
 * TODO If post date unavailable, set to today
 */
import React from 'react'
import ResponsiveForm from '../components/ResponsiveForm';
import { fieldType, fieldWidth } from '../components/Constants';
import { connect } from 'react-redux'
import buildEntityOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'title',        label: 'Title',     type: fieldType.TEXT,           displayWidth: fieldWidth.WIDE },
    { name: 'url',          label: 'URL',       type: fieldType.URL,            displayWidth: fieldWidth.NARROW },
    { name: 'person',       label: 'Person',    type: fieldType.SELECT_ENTITY,  displayWidth: fieldWidth.NORMAL },
    { name: 'company',      label: 'Company',   type: fieldType.SELECT_ENTITY,  displayWidth: fieldWidth.NORMAL },
    { name: 'postedDate',   label: 'Posted',    type: fieldType.DATE,           displayWidth: fieldWidth.NARROW },
    { name: 'appliedDate',  label: 'Applied',   type: fieldType.DATE,           displayWidth: fieldWidth.NARROW }, 
    { name: 'hide',         label: 'Hide',      type: fieldType.BOOLEAN_HIDDEN, displayWidth: fieldWidth.NARROW}
]

/**
 * Generates a Position component
 * @param {object} entity: an existing company, or null to create a new one
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} companies: all the Company entities
 * @param {array} persons: all the Personentities
 * @returns the component
 */
function Position({ entity, closeForm, companies, persons }) {
    const optionSets = buildEntityOptionSets([
        { entityList: companies, type: 'company', mappedAttribute: 'name' },
        { entityList: persons, type: 'person', mappedAttribute: 'name' },
    ])

    let isNew
    if (entity == null) {
        isNew = true
        entity = { postedDate: new Date() }
    }

    return (
        <ResponsiveForm
            theEntity={entity}
            entityClass="Position"
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
    }
}

export default connect(mapStateToProps)(Position)
