/**
 * A modal popup for creating or viewing/editing a company
 * props.company
 * props.new
 */
import React, { Component } from 'react';
import { Modal, Panel, Button } from 'react-bootstrap';
import * as actions from './CompanyActions';
import { connect } from 'react-redux';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import * as x from '../components/ResponsiveForm';

class Company extends Component {

    state = {}

    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
        if (props.company){
            this.state.company = props.company
            this.state.isNew = false;
        }
        else {
            this.state.company = this.populateEmpty()
            this.state.isNew = true
        }
     }

    populateEmpty(){
        let company = {}
        this.fieldDefs.forEach((field, index) => {
            company[field.name] = undefined;
        })
        return company;
    }

    handleClose(company) {
        console.log(company)
        if (company){
            this.props.saveCompany(company, this.state.sNew)
        }
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
            <ResponsiveForm entity={this.state.company} fieldDefs={this.fieldDefs} handleClose={this.handleClose}/>
        )
    } 
}
const mapDispatchToProps = dispatch => {
    return {
        saveCompany: (company, isNew) => dispatch(actions.saveCompany(company, isNew))
    };
};

export default connect(null, mapDispatchToProps)(Company)