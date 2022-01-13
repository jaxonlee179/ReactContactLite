/**
 * A modal popup for creating, editing or viewing a Person.
 */
import React from 'react'
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm'
import { connect } from 'react-redux'
import buildEntityOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'name',     label: 'Name',              type: fieldType.TEXT },
    { name: 'email',    label: 'Email',             type: fieldType.TEXT },
    { name: 'phone',    label: 'Phone',             type: fieldType.TEXT },
    { name: 'company',  label: 'Company',           type: fieldType.SELECT_ENTITY },
    { name: 'linkedIn', label: 'LinkedIn Profile',  type: fieldType.URL }, 
    { name: 'hide',     label: 'Hide',              type: fieldType.BOOLEAN_HIDDEN}
]

/**
 * Generates a Person component
 * @param {object} entity: an existing company, or null to create a new one
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} companies: all the Company entities
 * @returns the component
 */
function Person({ entity, closeForm, companies }) {
    const optionSets = buildEntityOptionSets([
        { entityList: companies, type: 'company', mappedAttribute: 'name' },
    ])

    let isNew
    if (entity == null) {
        isNew = true
        entity = {}
    }
    return (
        <ResponsiveForm
            theEntity={entity}
            entityClass="Person"
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
    }
}
export default connect(mapStateToProps)(Person)
