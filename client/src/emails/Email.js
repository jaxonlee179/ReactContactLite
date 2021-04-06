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
    { name: 'from',     label: 'From',      type: fieldType.EMAIL},
    { name: 'to',       label: 'To',        type: fieldType.EMAIL},
    { name: 'cc',       label: 'Cc',        type: fieldType.EMAIL},
    { name: 'bcc',      label: 'Bcc',       type: fieldType.EMAIL},
    { name: 'date',     label: 'Date',      type: fieldType.DATE_TIME},
    { name: 'text',                         type: fieldType.TEXT_AREA},
]

const email = props => {
    const email = props.entity;
    
    return (
        <ResponsiveForm entity={email} entityClass='Email' fieldDefs={fieldDefs} closeForm={props.closeForm} readOnly='true'/>
    )
}

export default email;