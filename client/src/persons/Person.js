/**
 * A modal popup for creating or viewing/editing a person.
 * Properties:
 * props.person (optional) an existing person to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'name',     label: 'Name',      type: fieldType.TEXT},
    { name: 'email',    label: 'Email',     type: fieldType.TEXT},
    { name: 'phone',    label: 'Phone',     type: fieldType.TEXT},    
    { name: 'company',  label: 'Company',   type: fieldType.SELECT_ENTITY}    
]

class Person extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)
        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.companies, type: 'company', mappedAttribute: 'name'}
        ])
    }

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass='Person' fieldDefs={fieldDefs} optionSets={this.optionSets} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies
    }
}

export default withOptionSets(connect(mapStateToProps)(Person));