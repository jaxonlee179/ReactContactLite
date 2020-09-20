/**
 * A modal popup for creating or viewing/editing a company.
 * Properties:
 * props.company (optional) an existing company to edit
 * props.closeForm handler for Save and Close buttons
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

    entityClass = 'Company'

    constructor(props) {
        super(props)
    }

    populateEmpty(){
        let entity = {}
        this.fieldDefs.forEach((field, index) => {
            entity[field.name] = undefined;
        })
        return entity;
    }
    render() {
        const entity = this.props.entity ? this.props.entity : this.populateEmpty()
        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass={this.entityClass} fieldDefs={fieldDefs} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

export default Company