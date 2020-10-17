/** 
 * A sortable, editable and responsive table component. It switches from a conventional table to the 
 * Collapse By Rows form.
 * 
 * In the table form the columns are sortable. 
 * 
 * Columns can be specified as containing URLs, in which case the cell content is rendered as link elements,
 * opening a new window, rather than plain text. 
 * 
 * A click listener can be supplied to process clicks elsewhere in a row. 
*/
import React from 'react';
import styled from 'styled-components'
import { fieldType } from './ResponsiveForm';
import moment from 'moment';

/**
 * Generates a ResponsiveTable component
 * @param {object array} props.entities Table data, one element per row 
 * @param {array} props.fieldDefs Array of { name, label, type }  
 * @param {object} props.colors (Optional) Color override values 
 * @param {object} props.sortProps (Optional)
 * @param {object} props.onRowClick (Optional) listener for mouse click events 
 * @param {string} props.border (Optional) Border override style
 */
const responsiveTable = props => {
    const cellWidth = ((1 / props.fieldDefs.length) * 100).toString().split('.')[0];
    
    const tableStyle = {
        textAlign: 'left',
        border: props.border ? props.border : '1px solid black'
    }

    const colors = setColors(props.colors)

    return (
        <div style={tableStyle}>
            <StyledHeader fieldDefs={props.fieldDefs} cellWidth={cellWidth} colors={colors} sortProps={props.sortProps} entities={props.entities}/>
            {props.entities.map((entity, index) => {
                return (
                    <StyledRow entity={entity} 
                        striped={index % 2 === 1} 
                        fieldDefs={props.fieldDefs}
                        optionSets={props.optionSets}
                        entityMaps={props.entityMaps}
                        colors={colors} 
                        cellWidth={cellWidth} 
                        primary={props.primary} 
                        key={index}
                        rowIndex={index}
                        onRowClick={props.onRowClick}
                        />
                )
            })}
        </div>
     )
}

/**
 * Establishes the colors from defaults and override values from the component properties
 * @param propColors (Optional) one or more color override attributes
 * @return the combined colors
 */ 
const setColors = propColors => {
    const defaultColors = {
        headerText: 'white',
        headerBg: 'black',
        rowText: 'black',
        rowBg: 'white',
        rowStripe: 'gainsboro'
    }
    if (propColors){
        return {
            headerText: propColors.headerText ?  propColors.headerText : 'white',
            headerBg: propColors.headerBg ?  propColors.headerBg : 'black',
            rowText: propColors.rowText ?  propColors.rowText : 'black',
            rowBg: propColors.rowBg ? propColors.rowBg : 'white',
            rowStripe: propColors.rowStripe ?  propColors.rowStripe : 'gainsboro'
        }
    }
    else {
        return defaultColors;
    }
}

/**
 * Creates the Header
 * @param {*} props 
 */
const Header = props => {
    const labelStyle = { width: props.cellWidth + '%' }
    
    const doSort = props.sortProps ? props.sortProps.doSort : undefined;
    const sortColumn = props.sortProps ? props.sortProps.column : undefined;
    const ascending = props.sortProps ? props.sortProps.ascending : undefined;
    
    return <div className={props.className}>
            {props.fieldDefs.map((fieldDef, index) => {
                if (doSort && sortColumn === index){
                    if (ascending){
                        return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index, props.fieldDefs, props.entities)}>
                            {fieldDef.label}<span className="fas fa-caret-down fa-lg"></span>
                        </div>
                    }
                    else {
                        return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index, props.fieldDefs, props.entities)}>
                            {fieldDef.label}<span className="fas fa-caret-up fa-lg"></span>
                        </div>
                    }
                }
                else {
                    return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index, props.fieldDefs, props.entities)}>{fieldDef.label}</div>
                }
            })}
    </div>
}

const doNewSort = (sortProps, column, fieldDefs, entities) => {
    const ascending = sortProps.column === column ? !sortProps.ascending : false
    const sorted = [...entities].sort( (a, b) => {
        return ascending ? -a[fieldDefs[column].name].localeCompare(b[fieldDefs[column].name]) 
        : a[fieldDefs[column].name].localeCompare(b[fieldDefs[column].name])
    })
    sortProps.afterSort(sorted, column, ascending);
}

const StyledHeader = styled(Header)`
    color: ${props => props.colors.headerText};
    background-color: ${props => props.colors.headerBg};
    display: flex;
    padding: 0.2em;
    @media all and (max-width: 768px) {
        display: none;
    }
`
const Row = props => {
    return (<div className={props.className}>
        {props.fieldDefs.map((fieldDef, index) => {
           return (
                <StyledCell width={props.cellWidth} colors={props.colors} primary={props.primary === index} key={index}>
                    <CollapsedLabel>{fieldDef.label}</CollapsedLabel>
                    <CellContent value={props.entity[fieldDef.name]} 
                    type={fieldDef.type} entityMap={props.entityMaps ? props.entityMaps[fieldDef.name] : null}
                    onRowClick={(e) => props.onRowClick(e, props.rowIndex, props.entity)}></CellContent>
                </StyledCell>
            )
        })}
    </div>)
}

const StyledRow = styled(Row)`
    display: flex;
    padding: 0.2em;
    color: ${props => props.colors.rowText};
    background-color: ${props => props.striped ? props.colors.rowStripe : props.colors.rowBg};
    @media all and (max-width: 768px) {
        flex-direction: column;
    }
`
const Cell = ({ className, children }) => {
    return <div className={className}>
        {children}
    </div>
}

const StyledCell = styled(Cell)`
    overflow: hidden;
    width: ${props => props.width + '%'};
    @media all and (max-width: 768px) {
        display: flex;
        width: 100% !important;    
    }
`
const CollapsedLabel = styled.div`
    display: none;
    @media all and (max-width: 768px) {
        display: inline;
        flex-basis: 30%;
        text-align: right;
        margin-right: 0.6em;
        overflow: hidden;    
    }
`
const UnstyledCellContent = props => {
    if (props.type === fieldType.URL){
        const url = props.value.startsWith('http') ? props.value : 'http://' + props.value
        return <a href={url} target='_blank'>{props.value}</a>
    }
    else if (props.type === fieldType.DATE){
        // Convert from ISO format
        const reformatted = props.value ? moment(new Date(props.value)).format('ddd, MMM Do YYYY') : '';
        return <span onClick={props.onRowClick}>{reformatted}</span>
    }
    else if (props.type === fieldType.DATE_TIME){
        // Convert from ISO format
        const reformatted = props.value ? moment(new Date(props.value)).format('ddd, MMM Do YYYY, h:mm a') : '';
        return <span onClick={props.onRowClick}>{reformatted}</span>
    }
    else if (props.type === fieldType.SELECT){
        let displayValue = props.value ? props.entityMap.entities[props.value][props.entityMap.displayField] : ''
        return <span onClick={props.onRowClick}>{displayValue}</span>
    }
    else {
        return <span onClick={props.onRowClick}>{props.value}</span>
    }
}
const CellContent = styled(UnstyledCellContent)`
    @media all and (max-width: 768px) {
        display: inline !important;
        overflow: hidden;
        margin-bottom: 0.6em;
    }
`
export default responsiveTable;

