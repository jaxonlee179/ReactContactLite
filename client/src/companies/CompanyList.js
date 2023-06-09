import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Company, { fieldDefs } from './Company';
import * as actions from './CompanyActions';

/**
 * Generates the Company list component
 */
function CompanyList () {
    
    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ company,        setCompany ]        = useState(null); 
    const [ showHidden,     setShowHidden ]     = useState(false); 

    const dispatch = useDispatch();
    
    const companies = useSelector(state => state.companyReducer.companies);    

    function afterSort(sorted, column, ascending) {
        dispatch( { type: actions.STORE_ALL, companies: sorted})
        setColumn(column);
        setAscending(ascending);        
    }
    
    /**
     * Displays the popup to create a new company
     */
    function createNew(){
        setSelectedRow(null);
        setDisplayForm(true);
        setCompany(null);
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} company the full MongoDB company object retrieved from the server
     */
    function select(e, selectedRow, company){
        setSelectedRow(selectedRow);
        setDisplayForm(true);
        setCompany(company);
    }

    /**
     * Change handler for 'hide' checkboxes
     * @param {object} e unused
     * @param {number} rowIndex 
     */
     function onChangeHide(e, rowIndex){
        const company = {...companies[rowIndex]}
        company.hide = !company.hide
        dispatch(actions.saveCompany(company, rowIndex))
    }

    /**
     * Removes or restores 'hidden' entities from the display 
     */
     const toggleShowHidden = () => setShowHidden(!showHidden)

     function closeForm(company){
        setDisplayForm(false);
        if (company) {
            dispatch(actions.saveCompany(company, selectedRow))
        }    
    }

    const sortProps = {
        afterSort, 
        column, 
        ascending
    }
    const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color

    return (
        <div>
            <ListHeaderFooter 
                header='true' 
                name='Companies' 
                label='New Company' 
                createNew={createNew} 
                fieldDefs={fieldDefs}
                showHidden={showHidden}
                toggleShowHidden={toggleShowHidden}/>
            <ResponsiveTable
                entities={companies}
                fieldDefs={fieldDefs}
                colors={colors}
                showHidden={showHidden}
                sortProps={sortProps}
                onRowClick={select} 
                onChangeHide={onChangeHide}/>
            {displayForm && <Company entity={company} closeForm={closeForm}></Company> }
        </div>
    )
}

export default CompanyList;
