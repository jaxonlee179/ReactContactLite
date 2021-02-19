/**
 * A modal popup for creating or viewing/editing an Position.
 * Properties:
 * props.position (optional) an existing position to edit
 * props.closeForm handler for Save and Close buttons
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';
import withOptionSets from '../hoc/withOptionSets'

export const fieldDefs = [
    { name: 'title',        label: 'Title',     type: fieldType.TEXT},
    { name: 'url',          label: 'URL',       type: fieldType.URL},
    { name: 'person',       label: 'Person',    type: fieldType.SELECT_ENTITY},    
    { name: 'company',      label: 'Company',   type: fieldType.SELECT_ENTITY},    
    { name: 'postedDate',   label: 'Posted',    type: fieldType.DATE},
    { name: 'appliedDate',  label: 'Applied',   type: fieldType.DATE}
]

class Position extends Component {

    state = {}
    optionSets = {}
     
    constructor(props) {
        super(props)

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.companies, type: 'company',  mappedAttribute: 'name'},
            {entityList: this.props.persons,   type: 'person',   mappedAttribute: 'name'}
        ])
    }

    render() {
        const entity = this.props.entity ? this.props.entity : {}
        console.log("from server" + entity.when)

        const isNew = this.props.entity == null
        return (
            <ResponsiveForm entity={entity} entityClass='Position' fieldDefs={fieldDefs} optionSets={this.optionSets} closeForm={this.props.closeForm} isNew={isNew}/>
        )
    } 
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies,
        persons: state.personReducer.persons
    }
}

export default withOptionSets(connect(mapStateToProps)(Position));