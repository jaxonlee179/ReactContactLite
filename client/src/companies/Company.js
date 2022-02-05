/**
* A modal popup for creating, editing or viewing a Company.
*/
import React from 'react';
import ResponsiveForm from '../components/ResponsiveForm';
import { fieldType, fieldWidth } from '../components/Constants';

export const fieldDefs = [
    { name: 'name',   label: 'Name',    type: fieldType.TEXT,           displayWidth: fieldWidth.NORMAL},
    { name: 'url',    label: 'URL',     type: fieldType.URL,            displayWidth: fieldWidth.NORMAL},
    { name: 'address',label: 'Address', type: fieldType.TEXT,           displayWidth: fieldWidth.NORMAL},
    { name: 'city',   label: 'City',    type: fieldType.TEXT,           displayWidth: fieldWidth.NARROW},
    { name: 'phone',  label: 'Phone',   type: fieldType.TEXT,           displayWidth: fieldWidth.NARROW}, 
    { name: 'hide',   label: 'Hide',    type: fieldType.BOOLEAN_HIDDEN, displayWidth: fieldWidth.NARROW}
]

/**
 * Generates a Company component
 * @param {object} entity: an existing company, or null to create a new one 
 * @param {function} closeForm: handler for Save and Close buttons
 * @returns the component
 */
function Company ( { entity, closeForm }) {

    let isNew;
    if (entity == null){
        isNew = true;
        entity = {}
    }
    return (
        <ResponsiveForm theEntity={entity} entityClass='Company' fieldDefs={fieldDefs} closeForm={closeForm} isNew={isNew} />
    )
}

export default Company