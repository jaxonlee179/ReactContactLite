import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Person, { fieldDefs } from './Person';
import * as actions from './PersonActions';

function PersonList () {

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ person,         setPerson ]         = useState(null); 

    const dispatch = useDispatch();
    
    const persons = useSelector(state => state.personReducer.persons);
    const companiesMap = useSelector(state => state.companyReducer.companiesMap);

    function afterSort (sorted, column, ascending) {
        dispatch( { type: actions.STORE_ALL, persons: sorted})
        setColumn(column);
        setAscending(ascending);        
    }
    /**
     * Displays the popup to create a new person
     */
     function createNew(){
        setSelectedRow(null);
        setDisplayForm(true);
        setPerson(null);
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} person the full MongoDB person object retrieved from the server
     */
     function select(e, selectedRow, person){
        setSelectedRow(selectedRow);
        setDisplayForm(true);
        setPerson(person);
    }

    function closeForm(person){
        setDisplayForm(false);
        if (person) {
            dispatch(actions.savePerson(person, selectedRow))
        }    
    }

    const sortProps = {
        afterSort,
        column,
        ascending
    }
    const entityMaps = {
        'company': { entities: companiesMap, displayField: 'name' }
    }
    const colors = { headerBg: '#2c3e50' } // Set to bootstrap-<them>.css body color
    return (
        <div>
            <ListHeaderFooter header='true' name='Persons' label='New Person' createNew={createNew} />
            <ResponsiveTable
                entities={persons}
                entityMaps={entityMaps}
                fieldDefs={fieldDefs}
                colors={colors}
                sortProps={sortProps}
                onRowClick={select} />
            {displayForm ? <Person entity={person} closeForm={closeForm}></Person> : ''}
        </div>
    )
}

export default PersonList;
