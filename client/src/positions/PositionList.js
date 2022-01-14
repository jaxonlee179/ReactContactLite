import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Position, { fieldDefs } from './Position';
import * as actions from './PositionActions';

/**
 * Generates the Position list component
 */
 function PositionList () {

    const [ column,         setColumn ]         = useState(null); 
    const [ ascending,      setAscending ]      = useState(null); 
    const [ displayForm,    setDisplayForm ]    = useState(false); 
    const [ selectedRow,    setSelectedRow ]    = useState(null); 
    const [ position,       setPosition ]       = useState(null); 
    const [ showHidden,     setShowHidden ]     = useState(false); 

    const dispatch = useDispatch();
    
    const positions = useSelector(state => state.positionReducer.positions);
    const companiesMap = useSelector(state => state.companyReducer.companiesMap);
    const personsMap = useSelector(state => state.personReducer.personsMap);

    function afterSort (sorted, column, ascending) {
        dispatch( { type: actions.STORE_ALL, positions: sorted})
        setColumn(column);
        setAscending(ascending);        
    }
    
    /**
     * Displays the popup to create a new position
     */
    function createNew(){
        setSelectedRow(null);
        setDisplayForm(true);
        setPosition(null);
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} position the full MongoDB position object retrieved from the server
     */
    function select(e, selectedRow, position){
        setSelectedRow(selectedRow);
        setDisplayForm(true);
        setPosition(position);
    }

    /**
     * Change handler for 'hide' checkboxes
     * @param {object} e unused
     * @param {number} rowIndex 
     */
     function onChangeHide(e, rowIndex){
        const position = {...positions[rowIndex]}
        position.hide = !position.hide
        dispatch(actions.savePosition(position, rowIndex))
    }

    /**
     * Removes or restores 'hidden' entities from the display 
     */
    const toggleShowHidden = () => setShowHidden(!showHidden)

    function closeForm(position){
        setDisplayForm(false);
        if (position) {
            dispatch(actions.savePosition(position, selectedRow))
        }    
    }

    const sortProps = {
        afterSort,
        column,
        ascending
    }
    const entityMaps = {
        'company': { entities: companiesMap, displayField: 'name' },
        'person': { entities: personsMap, displayField: 'name' }
    }
    const colors = { headerBg: '#2c3e50' } // Set to bootstrap-<them>.css body color
    return (
        <div>
            <ListHeaderFooter 
            header='true' 
            name='Positions' 
            label='New Position' 
            createNew={createNew} 
            fieldDefs={fieldDefs}
            showHidden={showHidden}
            toggleShowHidden={toggleShowHidden}/>
            <ResponsiveTable
                entities={positions}
                entityMaps={entityMaps}
                fieldDefs={fieldDefs}
                colors={colors}
                sortProps={sortProps}
                showHidden={showHidden}
                onRowClick={select}
                onChangeHide={onChangeHide} />
            {displayForm ? <Position entity={position} closeForm={closeForm}></Position> : ''}
        </div>
    )
}

export default PositionList;
