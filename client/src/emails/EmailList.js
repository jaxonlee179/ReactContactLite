/**
 * Am EmailList is a "read only" table of emails, either all those in the system,
 * or those sent by a specified Person
 */
import React, {useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Email, { fieldDefs } from './Email';
import * as actions from './EmailActions';

function EmailList (){

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ email,          setEmail ]          = useState(null); 

    const dispatch = useDispatch();
    
    const emails = useSelector(state => state.emailReducer.emails);

    const displayFieldDefs = fieldDefs.filter( fieldDef => {
        // For compactness, cc and bcc will not be shown in the table
        return fieldDef.name !== 'cc' && fieldDef.name !== 'bcc' && fieldDef.name !== 'text'
    });

    function afterSort (sorted, column, ascending) {
        dispatch( { type: actions.STORE_ALL, emails: sorted})
        setColumn(column);
        setAscending(ascending);        
    }
    
    /**
     * Responds to mouse click anywhere on the row. 
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} email the full MongoDB email object retrieved from the server
     */
    function select(e, selectedRow, email){
        setDisplayForm(true);
        setEmail(email);
   }

    function closeForm(email){
        setDisplayForm(false);
    }

    const sortProps = {
        afterSort,
        column,
        ascending
    }
    const colors = { headerBg: '#2c3e50' } // Set to bootstrap-<them>.css body color

    return (
        <div>
            <ListHeaderFooter header='true' name='Emails' label='Email' readOnly='true' />
            <ResponsiveTable
                entities={emails}
                fieldDefs={displayFieldDefs}
                colors={colors}
                sortProps={sortProps}
                onRowClick={select}
                readOnly='true' />
            {displayForm ? <Email entity={email} closeForm={closeForm}></Email> : ''}
        </div>
    )
}

export default EmailList;
