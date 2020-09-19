/**
 * A modal popup for creating or viewing/editing a company.
 * Properties:
 * props.company (optional) an existing company to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';

class Company extends Component {

    // state = {}

    constructor(props) {
        super(props)
        // this.state.company = props.company ? props.company : this.populateEmpty()
    }

    // Creates a new empty company object
    populateEmpty(){
        let company = {}
        this.fieldDefs.forEach((field, index) => {
            company[field.name] = undefined;
        })
        return company;
    }

    fieldDefs = [
        { name: 'name',   label: 'Name',    type: fieldType.TEXT},
        { name: 'url',    label: 'URL',     type: fieldType.TEXT},
        { name: 'address',label: 'Address', type: fieldType.TEXT},
        { name: 'city',   label: 'City',    type: fieldType.TEXT},
        { name: 'phone',  label: 'Phone',   type: fieldType.TEXT}    
    ]
    render() {
        const entity = this.props.company ? this.props.company : this.populateEmpty()
        const isNew = this.props.company == null
        return (
            <ResponsiveForm entity={entity} entityClass='Company' fieldDefs={this.fieldDefs} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

export default Company