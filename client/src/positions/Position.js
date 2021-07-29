/**
 * A modal popup for creating, editing or viewing a Position.
 */
import React from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import buildOptionSets from '../utilities/entityOptionsHelper'

export const fieldDefs = [
    { name: 'title',        label: 'Title',     type: fieldType.TEXT},
    { name: 'url',          label: 'URL',       type: fieldType.URL},
    { name: 'person',       label: 'Person',    type: fieldType.SELECT_ENTITY},    
    { name: 'company',      label: 'Company',   type: fieldType.SELECT_ENTITY},    
    { name: 'postedDate',   label: 'Posted',    type: fieldType.DATE},
    { name: 'appliedDate',  label: 'Applied',   type: fieldType.DATE}
]

/**
 * Generates a Position component
 * @param {object} entity: an existing company, or null to create a new one 
 * @param {function} closeForm: handler for Save and Close buttons
 * @param {array} companies: all the Company entities
 * @param {array} persons: all the Personentities
 * @returns the component
 */
function Position({entity, closeForm, companies, persons }) {

    const optionSets = buildOptionSets([
        {entityList: companies, type: 'company', mappedAttribute: 'name'},
        {entityList: persons,   type: 'person',  mappedAttribute: 'name'}
    ]);

    let isNew;
    if (entity == null){
        isNew = true;
        entity = {}
    }

    return <ResponsiveForm theEntity={entity} entityClass='Position' fieldDefs={fieldDefs} optionSets={optionSets} closeForm={closeForm} isNew={isNew}/>
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies,
        persons: state.personReducer.persons
    }
}

export default connect(mapStateToProps)(Position);