/**
 * A modal popup for creating or viewing/editing a company
 * props.company
 * props.new
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';

class Company extends Component {

    state = {}

    constructor(props) {
        super(props)
        this.state.company = props.company ? props.company : this.populateEmpty()
    }

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
        return (
            <ResponsiveForm entity={this.state.company} fieldDefs={this.fieldDefs} closeForm={this.props.closeForm}/>
        )
    } 
}

export default Company