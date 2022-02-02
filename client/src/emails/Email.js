/**
 * A modal popup for viewing an Email.
 */
import React, { useState, useMemo } from 'react';
import NewWindow from 'react-new-window';

import ResponsiveForm, { fieldType, fieldWidth } from '../components/ResponsiveForm';

export const fieldDefs = [
    { name: 'subject',  label: 'Subject',   type: fieldType.TEXT,           displayWidth: fieldWidth.WIDE},
    { name: 'from',     label: 'From',      type: fieldType.EMAIL,          displayWidth: fieldWidth.WIDE},
    { name: 'to',       label: 'To',        type: fieldType.EMAIL,          displayWidth: fieldWidth.WIDE},
    { name: 'cc',       label: 'Cc',        type: fieldType.EMAIL,          displayWidth: fieldWidth.NORMAL},
    { name: 'bcc',      label: 'Bcc',       type: fieldType.EMAIL,          displayWidth: fieldWidth.NORMAL},
    { name: 'date',     label: 'Date',      type: fieldType.DATE_TIME,      displayWidth: fieldWidth.WIDE},
    { name: 'text',                         type: fieldType.TEXT_AREA,      displayWidth: fieldWidth.WIDE }, 
    { name: 'hide',     label: 'Hide',      type: fieldType.BOOLEAN_HIDDEN, displayWidth: fieldWidth.NARROW}
]

/**
 * Generates the Email component
 * @param {array} attachments 
 * @param {object} entity the Email entity
 * @param {function} closeForm 
 * @return the component 
 */
function Email ( {entity, closeForm} ) {

    const [ showAttachment, setShowAttachment ] = useState(false);
    const [ attachmentUrl, setAttachmentUrl ] = useState(null);

    // Prevent warning "React Hook useMemo has a missing dependency: 'prepareAttachments'." 
    /* eslint-disable */ 
    const {email, newFieldDefs} = useMemo( () => prepareAttachments(entity), [entity] );
    /* eslint-enable */
    
    function prepareAttachments(entity){
        if (entity.attachments.length === 0) {
            // Use existing field definitions
            return {
                email: entity,
                newFieldDefs: fieldDefs
            }
        }
            
        // Link fields must be added to the field definitions for each attachment
        const newFieldDefs = [...fieldDefs]
        // Attachment fields in the email must be augmented with URLs to fetch them
        const newEmail = { ...entity }

        entity.attachments.forEach((attachment, index) => {
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
            if (!baseUri) {
                baseUri = document.baseURI
                baseUri = baseUri.substring(0, baseUri.lastIndexOf('/'))
            }
            let url = `${baseUri}/attachments/${key}`

            // Attachments will be displayed in a new window
            attachment.onClick = openAttachment;
            attachment.viewable = true
            if (attachment.contentType === 'application/msword') {
                // Wrap the url in one for Google Document Viewer to render a Word document           
                url = `https://docs.google.com/gview?url=${url}&embedded=true`;
            }
            attachment.url = url;
            newEmail[name] = attachment;
        })
        return {
            email: newEmail,
            newFieldDefs
        }
    }

    function closeAttachment() {
        setShowAttachment(false);
        setAttachmentUrl(null);
    }

    /**
     * Opens a new window to view a text or .doc attachment, or downloads the attachment  
     * @param {String} key 
     * @param {String} contentType 
     */
    function openAttachment (attachmentUrl) {
        setShowAttachment(true);
        setAttachmentUrl(attachmentUrl);
    }

    return (
        <>
        <ResponsiveForm theEntity={email} entityClass='Email' fieldDefs={newFieldDefs} closeForm={closeForm} readOnly='true' width='lg'/>
        {showAttachment ? <NewWindow url={attachmentUrl} title='title' onUnload={closeAttachment}/> : ''}
        </>
    )
}

export default Email;