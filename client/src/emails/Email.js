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
    { name: 'date',     label: 'Date',      type: fieldType.DATE_TIME}
]

class Email extends Component {

    state = {}

    constructor(props) {
        super(props)
        this.state = {
            showAttachment: false,
            attachmentUrl: null
        }
        this.openAttachment = this.openAttachment.bind(this);
        this.closeAttachment = this.closeAttachment.bind(this);
    }
    
    render(){
        const email = {...this.props.entity};
        const defs = [...fieldDefs];

        if (email.attachments) {
           
            email.attachments.forEach( (attachment, index) => {
                const name = `attachment${index}`
                defs.push({
                    name,
                    label: 'Attachment',
                    type: fieldType.ATTACHMENT
                })
                const key = attachment.key.substring(attachment.key.indexOf('/') + 1);
                const host = '34.221.243.254'
                const port = '8080'        
                let url = `http://${host}:${port}/attachments/${key}`        
                
                if ( attachment.contentType === 'text/plain' ||  attachment.contentType === 'application/msword') {
                    attachment.onClick = this.openAttachment;
                    attachment.viewable = true
                    if (attachment.contentType === 'application/msword') {
                        // Wrap the url in one for Google Document Viewer            
                        url = `https://docs.google.com/gview?url=${url}&embedded=true`;
                    }
                }
                attachment.url = url;
                email[name] = attachment;
            })
            defs.push( { name: 'text', type: fieldType.TEXT_AREA } );

            return (
                <>
                <ResponsiveForm entity={email} entityClass='Email' fieldDefs={defs} closeForm={this.props.closeForm} readOnly='true' width='lg'/>
                {this.state.showAttachment ? <NewWindow url={this.state.attachmentUrl} title='title' onUnload={this.closeAttachment}/> : ''}
                </>
            )
        }
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