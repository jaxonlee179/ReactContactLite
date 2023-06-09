/**
 * A sortable, editable and responsive table component. It switches from a conventional table to the
 * Collapse By Rows form as the width is reduced. This behavior is implemented using the styled-components package.
 *
 * The table form comprises a header with field labels followed by data rows, with optional column sorting.
 * The Collapse by Rows format displays each Entity as a vertical display of {label, value}. Sorting is not
 * available in this form.
 *
 * The field value types are those defined in the ResponsiveForm fieldTypes object. For fieldType.URL,
 * the cell is rendered as a link element rather than plain text; the target is opened in a new window.
 * 
 * If the entity type includes a 'hide' field, it is rendered as a checkbox. When checked, a given entity 
 * will be removed from the display. The table header will include a 'Show Hidden' / 'Hide Hidden' toggle
 * button. Clicking Show Hidden will restore all hidden rows to the table
 * 
 * The width of a field in the conventional table form varies according to its fieldType. This is
 * implemented using the CSS 'flex-grow' property  
 */
import React from 'react'
import styled from 'styled-components'
import { fieldType } from './Constants'
import Checkbox from './Checkbox'
import moment from 'moment'

const MAX_DISPLAY_URL = 30  // URL display values will be truncated to this length
const MAX_DISPLAY_TEXT = 50 // TEXT or TEXT_AREA display values will be truncated to this length

/**
 * Generates a ResponsiveTable component
 * @param {array}   entities Table data, one element per row
 * @param {array}   fieldDefs Array of { name, label, type } defining each field
 * @param {object}  entityMaps (Optional) a map of entity name to { displayField, entities }
 *                  where displayField is the attribute on which the entiies are sorted,
 *                  and entities is a map of entity id to entity of the table content.
 *                  It is required when the table includes columns which reference other
 *                  entities (via the id of the other entity)
 * @param {object}  sortProps {afterSort, column, ascending} where column, ascending record 
 *                  current sort state (null if no sort has occurred); aftersort invoked 
 *                  after the sort is performed
 * @param {function} onRowClick handler for clicking on a table row
 * @param {function} onChangeHide handler for the 'hide' checkbox, not
 *                  required if the entities do not include a 'hide' field
 * @param {boolean} showHidden if true, entities tagged as hidden will be displayed
 * @param {string}  border (Optional) Border override style
 * @param {object}  colors (Optional) Color override values
 */
const responsiveTable = ({
    entities,
    fieldDefs,
    entityMaps,
    sortProps,
    onRowClick,
    onChangeHide,
    showHidden,
    border,
    colors
}) => {
    const tableStyle = {
        textAlign: 'left',
        border: border ? border : '1px solid black',
    }

    let mappedColors = setColors(colors)

    // Create map of the fieldDef name to the fieldDef
    const fieldDefMap = {}
    fieldDefs.forEach((fieldDef) => {
        fieldDefMap[fieldDef.name] = fieldDef
    })

    return (
        <div style={tableStyle}>
            <StyledHeader
                fieldDefs={fieldDefs}
                fieldDefMap={fieldDefMap}
                entityMaps={entityMaps}
                colors={mappedColors}
                sortProps={sortProps}
                entities={entities}
            />
            {entities.map((entity, index) => {
                return (!entity.hide || showHidden) && (
                    <StyledRow
                        entity={entity}
                        striped={index % 2 === 1}
                        fieldDefs={fieldDefs}
                        entityMaps={entityMaps}
                        colors={mappedColors}
                        key={index}
                        rowIndex={index}
                        onRowClick={onRowClick}
                        onChangeHide={onChangeHide}
                    />
                )
            })}
        </div>
    )
}

/**
 * Establishes the colors from defaults and override values from the component properties
 * @param {object} propColors (Optional) one or more color override attributes
 * @return the combined colors
 */
const setColors = (propColors) => {
    const defaultColors = {
        headerText: 'white',
        headerBg: 'black',
        rowText: 'black',
        rowBg: 'white',
        rowStripe: 'gainsboro',
    }
    if (propColors) {
        return {
            headerText: propColors.headerText ? propColors.headerText : 'white',
            headerBg: propColors.headerBg ? propColors.headerBg : 'black',
            rowText: propColors.rowText ? propColors.rowText : 'black',
            rowBg: propColors.rowBg ? propColors.rowBg : 'white',
            rowStripe: propColors.rowStripe
                ? propColors.rowStripe
                : 'gainsboro',
        }
    } else {
        return defaultColors
    }
}

/**
 * Creates the table header with column labels
 */
const Header = ({
    fieldDefs,
    entityMaps,
    sortProps,
    entities,
    className
}) => {

    return (
        <div className={className}>
            {fieldDefs.map((fieldDef, index) => {
            const style = { flexGrow: fieldDef.displayWidth }
            return (
                    <div
                        style={style}
                        key={index}
                        onClick={(e) =>
                            doNewSort(
                                sortProps,
                                index,
                                fieldDefs,
                                entities,
                                entityMaps
                            )
                        }
                    >
                        {fieldDef.label}
                    </div>
                )
            })}
        </div>
    )
}

/**
 * Performs a sort on a selected column
 * @param {object}  sortProps As described in responsiveTableTable above
 * @param {number}  column index of the table column
 * @param {object}  fieldDefs As described in responsiveTableTable above
 * @param {array}   entities the entities displayed in the table
 * @param {array}   entityMaps (Optional)
 */
const doNewSort = (sortProps, column, fieldDefs, entities, entityMaps) => {
    const ascending = sortProps.column === column ? !sortProps.ascending : false
    const fieldName = fieldDefs[column].name
    const type = fieldDefs[column].type
    const entityMap = entityMaps ? entityMaps[fieldName] : null

    const sorted = [...entities].sort((aValue, bValue) => {
        let a = formSortField(aValue, type, fieldName, entityMap)
        let b = formSortField(bValue, type, fieldName, entityMap)
        let result = a ? (b ? -a.localeCompare(b) : -1) : b ? 1 : 0
        return ascending ? result : -result
    })
    // Send the sorted data, the column index and the ascending/descending state to the parent component
    sortProps.afterSort(sorted, column, ascending)
}

const formSortField = (value, type, fieldName, entityMap) => {
    if (type === fieldType.EMAIL) {
        // Convert EMAIL fields from object {name, address } to string address
        return value[fieldName][0]['address']
    } 
    else if (type === fieldType.SELECT_ENTITY) {
        // "Foreign" entities are represented by id rather than display value, so look up the value
        const id = value[fieldName]
        return id ? entityMap.entities[id][entityMap.displayField] : ''
    } 
    else {
        return value[fieldName]
    }
}

const StyledHeader = styled(Header)`
    color: ${(props) => props.colors.headerText};
    background-color: ${(props) => props.colors.headerBg};
    display: flex;
    padding: 0.2em;
    @media all and (max-width: 768px) {
        display: none;
    }
`
const Row = ({fieldDefs, className, colors, entity, entityMaps, onRowClick, onChangeHide, rowIndex}) => {
    return (
        <div className={className}>
            {fieldDefs.map((fieldDef, index) => {
                return (
                    <StyledCell
                        width={fieldDef.displayWidth}
                        colors={colors}
                        key={index}
                    >
                        <CollapsedLabel>{fieldDef.label}</CollapsedLabel>
                        <StyledCellContent
                            value={entity[fieldDef.name]}
                            type={fieldDef.type}
                            entity={entity}
                            entityMap={entityMaps && entityMaps[fieldDef.name]}
                            onRowClick={(e) => onRowClick(e, rowIndex, entity)}
                            onChangeHide={(e) => onChangeHide(e, rowIndex)}
                        ></StyledCellContent>
                    </StyledCell>
                )
            })}
        </div>
    )
}

const StyledRow = styled(Row)`
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.2em;

    color: ${({colors}) => colors.rowText};
    background-color: ${({striped, colors}) =>
        striped ? colors.rowStripe : colors.rowBg};
    @media all and (max-width: 768px) {
        flex-direction: column;
        white-space: nowrap;
    }
`
const Cell = ({ width, colors, key, className, children }) => {
    return <div className={className}>{children}</div>
}

const StyledCell = styled(Cell)`
    max-height: 1.5em;
    flex: ${(props) => props.width};
    @media all and (max-width: 768px) {
        display: flex;
        width: 100% !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: clip;
    }
`

//         display: inline;

const CollapsedLabel = styled.div`
    display: none;
    @media all and (max-width: 768px) {
        display: block;
        flex-grow: 3;
        flex-basis: 3;
        text-align: right;
        margin-right: 0.6em;
    }
`
const CellContent = ({type, value, entity, onRowClick, entityMap, onChangeHide, className}) => {
    if (type === fieldType.URL) {
        const url = value.startsWith('http')
            ? value
            : 'http://' + value
        return (
            <a className={className} href={url} target="_blank" rel="noopener noreferrer">
                {value.slice(0, MAX_DISPLAY_URL)}
            </a>
        )
    } 
    else if (type === fieldType.DATE) {
        // Convert from ISO format
        const reformatted = value && moment(new Date(value)).format('ddd, MMM Do YYYY')
        return <span className={className} onClick={onRowClick}>{reformatted}</span>
    } 
    else if (type === fieldType.DATE_TIME) {
        // Convert from ISO format
        const reformatted = value && moment(new Date(value)).format('ddd, MMM Do YYYY, h:mm a')
        return <span className={className} onClick={onRowClick}>{reformatted}</span>
    } 
    else if (type === fieldType.SELECT_ENTITY) {
        const displayValue = value && entityMap.entities[value][entityMap.displayField]
        return <span className={className} onClick={onRowClick}>{displayValue}</span>
    } 
    else if (type === fieldType.SELECT) {
        const displayValue = value ? value : ''
        return <span className={className} onClick={onRowClick}>{displayValue}</span>
    } 
    else if (type === fieldType.EMAIL) {
        let displayValue
        if (value) {
            if (
                Object.getOwnPropertyNames(value).find(
                    (name) => name === 'address'
                )
            ) {
                //Single email, not an array
                displayValue = value[0].address
            } 
            else {
                displayValue = value[0].address
                if (value.length > 1) {
                    displayValue += `, ...${value.length - 1} more`
                }
            }
        } 
        else {
            displayValue = ''
        }
        return <span className={className} onClick={onRowClick}>{displayValue}</span>
    } 
    else if (type === fieldType.TEXT || type === fieldType.TEXT_AREA) {
        return (
            <div className={className} onClick={onRowClick}>
                {value && value.slice(0, MAX_DISPLAY_TEXT)}
            </div>
        )
    } 
    else if (type === fieldType.BOOLEAN_HIDDEN) {
        return <div className={className}><Checkbox  checked={entity.hide} onChange={onChangeHide}/></div>
    } 
    else {
        return <span onClick={onRowClick}>{value}</span>
    }
}
//         display: inline !important;

const StyledCellContent = styled(CellContent)`
    @media all and (max-width: 768px) {
        display: block;
        flex-grow: 7;
        flex-basis: 7;
        text-align: left;
    }
`
export default responsiveTable
