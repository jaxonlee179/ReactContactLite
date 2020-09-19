/** 
 * A sortable responsive table component. It switches from a conventional table to the 
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

/**
 * Generates a ResponsiveTable component
 * @param {object array} props.entities Table data, one element per row 
 * @param {string array} props.labels Column labels  
 * @param {object} props.colors (Optional) Color override values 
 * @param {string} props.border (Optional) Border override style
 * @param {object} props.sortProps (Optional)
 * @param {object} props.urlColumns (Optional) array of column indices to be marked up as a link
 * @param {object} props.onRowClick (Optional) listener for mouse click events 
 * @param {boolean} props.hasAppendedObject (Optional) if true, the last element of each row in props.data is an object which should not be rendered
 */
const responsiveTable = props => {
    const cellWidth = ((1 / props.labels.length) * 100).toString().split('.')[0];
    
    const tableStyle = {
        textAlign: 'left',
        border: props.border ? props.border : '1px solid black'
    }

    const colors = setColors(props.colors)

    return (
        <div style={tableStyle}>
            <StyledHeader labels={props.labels} cellWidth={cellWidth} colors={colors} sortProps={props.sortProps}/>
            {props.entities.map((entity, index) => {
                return (
                    <StyledRow entity={entity} 
                        striped={index % 2 === 1} 
                        labels={props.labels}
                        fieldOrder={props.fieldOrder} 
                        colors={colors} 
                        cellWidth={cellWidth} 
                        primary={props.primary} 
                        key={index}
                        rowIndex={index}
                        urlColumns={props.urlColumns}
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
            {props.labels.map((label, index) => {
                if (doSort && sortColumn === index){
                    if (ascending){
                        return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index)}>
                            {label}<span className="fas fa-caret-down fa-lg"></span>
                        </div>
                    }
                    else {
                        return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index)}>
                            {label}<span className="fas fa-caret-up fa-lg"></span>
                        </div>
                    }
                }
                else {
                    return <div style={labelStyle} key={index} onClick={(e) => doNewSort(props.sortProps, index)}>{label}</div>
                }
            })}
    </div>
}

const doNewSort = (sortProps, column) => {
    const ascending = sortProps.column === column ? !sortProps.ascending : false
    sortProps.doSort(column, ascending);
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
        {props.fieldOrder.map((fieldName, index) => {
            const isUrl = props.urlColumns && props.urlColumns.includes(index);
            return (
                <StyledCell width={props.cellWidth} colors={props.colors} primary={props.primary === index} key={index}>
                    <CollapsedLabel>{props.labels[index]}</CollapsedLabel>
                    <CellContent value={props.entity[fieldName]} isUrl={isUrl} onRowClick={(e) => props.onRowClick(e, props.rowIndex, props.entity)}></CellContent>
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
        display: block;
        width: 100% !important;    
    }
`
const CollapsedLabel = styled.div`
    display: none;
    @media all and (max-width: 768px) {
        display: inline-block;
        width: 30%;
        text-align: right;
        margin-right: 0.6em;
        overflow: hidden;    
    }
`
const inlineBlock = {display: 'inline-block'}
const UnstyledCellContent = props => {
    if (props.isUrl){
        const url = '/' + props.value;
        return (
            <a href={url} target='_blank'>{props.value}</a>
        )
    }
    else {
        return (
            <div style={inlineBlock} onClick={props.onRowClick}>{props.value}</div>
        )
    }
}
const CellContent = styled(UnstyledCellContent)`
    @media all and (max-width: 768px) {
        display: inline-block !important;
        overflow: hidden;
    }
`
export default responsiveTable;

