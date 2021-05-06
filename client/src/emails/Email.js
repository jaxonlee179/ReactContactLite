/**
 * A modal popup for viewing an Email.
 * Properties:
 * props.email the email object
 */
import React, { Component } from 'react';
import NewWindow from 'react-new-window';

import ResponsiveForm, { fieldType } from '../components/ResponsiveForm';

export const fieldDefs = [
    { name: 'subject',  label: 'Subject',   type: fieldType.TEXT},
    { name: 'from',     label: 'From',      type: fieldType.EMAIL},
    { name: 'to',       label: 'To',        type: fieldType.EMAIL},
    { name: 'cc',       label: 'Cc',        type: fieldType.EMAIL},
    { name: 'bcc',      label: 'Bcc',       type: fieldType.EMAIL},
    { name: 'date',     label: 'Date',      type: fieldType.DATE_TIME},
    { name: 'text',                         type: fieldType.TEXT_AREA }
]

class Email extends Component {

    constructor(props) {
        super(props)

        const attachments = props.entity.attachments
        if (attachments) {        
            this.openAttachment = this.openAttachment.bind(this);
            this.closeAttachment = this.closeAttachment.bind(this);

             // Link fields must be added to the field definitions for each attachment
            const newFieldDefs = [...fieldDefs]
            // Attachment fields in the email must be augmented with URLs to fetch them
            const newEmail = {...props.entity}

            attachments.forEach( (attachment, index) => {
                const name = `attachment${index}`
                // All link fields will be labelled "Attachment"
                newFieldDefs.push({
                    name,
                    label: 'Attachment',
                    type: fieldType.ATTACHMENT
                })
                // Create URL for retrieving the attachment
                const key = attachment.key.substring(attachment.key.indexOf('/') + 1);

                // For running on the dev server, set local env variable to point to remote server 
                let baseUri = process.env.REACT_APP_PROXY
                if (!baseUri){
                    baseUri = document.baseURI
                    baseUri = baseUri.substring(0, baseUri.lastIndexOf('/'))
                }
                let url = `${baseUri}/attachments/${key}`        
                
                // Attachments will be displayed in a new window
                attachment.onClick = this.openAttachment;
                attachment.viewable = true
                if (attachment.contentType === 'application/msword') {
                    // Wrap the url in one for Google Document Viewer to render a Word document           
                    url = `https://docs.google.com/gview?url=${url}&embedded=true`;
                }
                attachment.url = url;
                newEmail[name] = attachment;
            })
            this.state = {
                email: newEmail,
                fieldDefs: newFieldDefs
            }
        }
        else {
            // Use existing field definitions
            this.state = {
                email:  props.entity,
                fieldDefs
            }
        }
   }
    
    render(){
        return (
            <>
            <ResponsiveForm entity={this.state.email} entityClass='Email' fieldDefs={this.state.fieldDefs} closeForm={this.props.closeForm} readOnly='true' width='lg'/>
            {this.state.showAttachment ? <NewWindow url={this.state.attachmentUrl} title='title' onUnload={this.closeAttachment}/> : ''}
            </>
        )
    }

    closeAttachment() {
        this.setState({
            showAttachment: false,
            attachmentUrl: null
        })
    }

    /**
     * Opens a new window to view a text or .doc attachment, or downloads the attachment  
     * @param {String} key 
     * @param {String} contentType 
     */
    openAttachment (attachmentUrl) {
        this.setState({
            showAttachment: true,
            attachmentUrl
        })
    }
}

export default Email;