/**
* A modal popup for creating, editing or viewing a Company.
* Properties:
* {object} entity: the Company entity, empty or populated
* {function} closeForm: handler for Save and Close buttons
*/
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';

export const fieldDefs = [
    { name: 'name',   label: 'Name',    type: fieldType.TEXT},
    { name: 'url',    label: 'URL',     type: fieldType.URL},
    { name: 'address',label: 'Address', type: fieldType.TEXT},
    { name: 'city',   label: 'City',    type: fieldType.TEXT},
    { name: 'phone',  label: 'Phone',   type: fieldType.TEXT}    
]

class Company extends Component {

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass='Company' fieldDefs={fieldDefs} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

export default Company