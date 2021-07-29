import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Encounter, { fieldDefs } from './Encounter';
import Email from '../emails/Email';
import * as actions from './EncounterActions';

const PHONE_ENCOUNTER = 'phone'

/**
 * Genmerates the Encountert list component
 */
 function EncounterList () {

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ encounter,      setEncounter ]      = useState(null); 

    const dispatch = useDispatch();
    
    const encounters = useSelector(state => state.encounterReducer.encounters);
    const emailsMap = useSelector(state => state.emailReducer.emailsMap);
    const positionsMap = useSelector(state => state.positionReducer.positionsMap);
    const personsMap = useSelector(state => state.personReducer.personsMap);

    function afterSort (sorted, column, ascending)  {
        dispatch( { type: actions.STORE_ALL, encounters: sorted})
        setColumn(column);
        setAscending(ascending);        
    }
    
    /**
     * Displays the popup to create a new phone encounter
     */
     function createNew(){
        setSelectedRow(null);
        setDisplayForm(true);
        setEncounter(null);
   }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} encounter the full MongoDB encounter object retrieved from the server
     */
     function select(e, selectedRow, encounter){
        setSelectedRow(selectedRow);
        setDisplayForm(true);
        setEncounter(encounter);
    }

    function closeForm(encounter){
        setDisplayForm(false);
        if (encounter) {
            if (!encounter.type){
                encounter.type = PHONE_ENCOUNTER
            }
            dispatch(actions.saveEncounter(encounter, selectedRow))
        }    
    }

     const sortProps = {
         afterSort,
         column,
         ascending
     }
     const entityMaps = {
         'position': { entities: positionsMap, displayField: 'title' },
         'person': { entities: personsMap, displayField: 'name' },
     }

     // The encounter type field will not be displayed. It's value will be set
     // to 'phone' upon first saving
     // const defs = fieldDefs.filter( fieldDef => fieldDef.name != 'type')

     const colors = { headerBg: '#2c3e50' } // Set to bootstrap-<them>.css body color

     const showPhonePopup = displayForm && ((encounter && encounter.type === 'phone') || !encounter)
     const showEmailPopup = displayForm && encounter && encounter.type === 'email'

     return (
         <div>
             <ListHeaderFooter header='true' name='Encounters' label='New Encounter' createNew={createNew} />
             <ResponsiveTable
                 entities={encounters}
                 entityMaps={entityMaps}
                 fieldDefs={fieldDefs}
                 colors={colors}
                 sortProps={sortProps}
                 onRowClick={select} />
             {showPhonePopup ? <Encounter entity={encounter} closeForm={closeForm} /> : ''}
             {showEmailPopup ? <Email entity={emailsMap[encounter.email]} closeForm={closeForm} /> : ''}
         </div>
     )
}

export default EncounterList;
