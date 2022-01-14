import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Person, { fieldDefs } from './Person';
import * as actions from './PersonActions';

/**
 * Generates the Person list component
 */
 function PersonList () {

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ person,         setPerson ]         = useState(null); 
    const [ showHidden,     setShowHidden ]     = useState(false); 

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

    /**
     * Change handler for 'hide' checkboxes
     * @param {object} e unused
     * @param {number} rowIndex 
     */
    function onChangeHide(e, rowIndex){
        const person = {...persons[rowIndex]}
        person.hide = !person.hide
        dispatch(actions.savePerson(person, rowIndex))
    }

    /**
     * Removes or restores 'hidden' entities from the display 
     */
    const toggleShowHidden = () => setShowHidden(!showHidden)

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
            <ListHeaderFooter 
                header='true' 
                name='Persons' 
                label='New Person' 
                createNew={createNew} 
                fieldDefs={fieldDefs}
                showHidden={showHidden}
                toggleShowHidden={toggleShowHidden}/>
            <ResponsiveTable
                entities={persons}
                entityMaps={entityMaps}
                fieldDefs={fieldDefs}
                colors={colors}
                sortProps={sortProps}
                showHidden={showHidden}
                onRowClick={select}
                onChangeHide={onChangeHide} />
            {displayForm ? <Person entity={person} closeForm={closeForm}></Person> : ''}
        </div>
    )
}

export default PersonList;
