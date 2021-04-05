/**
 * A modal popup for viewing an email.
 * Properties:
 * props.email the email object
 */
import React, { Component } from 'react';
import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';
import { connect } from 'react-redux';

export const fieldDefs = [
    { name: 'subject',  label: 'Subject',   type: fieldType.TEXT},
    { name: 'from',     label: 'From',      type: fieldType.TEXT},
    { name: 'to',       label: 'To',        type: fieldType.TEXT},
    { name: 'cc',       label: 'Cc',        type: fieldType.TEXT},
    { name: 'bcc',      label: 'Bcc',       type: fieldType.TEXT},
    { name: 'date',     label: 'Date',      type: fieldType.DATE},
    { name: 'text',     label: '',          type: fieldType.TEXT_AREA},
]

const email = props => {
    const email = props.email;
    
    return (
        <ResponsiveForm entity={email} entityClass='Email' fieldDefs={fieldDefs} closeForm={this.props.closeForm} isReadOnly='true'/>
    )
}

export default email;