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
 */
import React from 'react'
import styled from 'styled-components'
import { fieldType } from './ResponsiveForm'
import moment from 'moment'

const MAX_DISPLAY_URL = 30 // URL display values will be truncated to this length
const MAX_DISPLAY_TEXT = 50 // TEXT or TEXT_AREA display values will be truncated to this length

/**
 * Generates a ResponsiveTable component
 * @param {array}   entities Table data, one element per row
 * @param {array}   fieldDefs Array of { name, label, type }
 * @param {object}  entityMaps (Optional) a map of entity name to { displayField, entities }
 *                  where displayField is the attribute on which the entiies are sorted,
 *                  and entities is a map of entity id to entity of the table content.
 *                  It is required when the table includes columns which reference other
 *                  entities (via the id of the other entity)
 * @param {function} onRowClick handler for clicking on a table row
 * @param {string}  border (Optional) Border override style
 * @param {object}  colors (Optional) Color override values
 */
const responsiveTable = ({
    entities,
    fieldDefs,
    entityMaps,
    sortProps,
    onRowClick,
    border,
    colors,
    primary,
}) => {
    const cellWidth = ((1 / fieldDefs.length) * 100).toString().split('.')[0]

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
                cellWidth={cellWidth}
                colors={mappedColors}
                sortProps={sortProps}
                entities={entities}
            />
            {entities.map((entity, index) => {
                return (
                    <StyledRow
                        entity={entity}
                        striped={index % 2 === 1}
                        fieldDefs={fieldDefs}
                        entityMaps={entityMaps}
                        colors={mappedColors}
                        cellWidth={cellWidth}
                        primary={primary}
                        key={index}
                        rowIndex={index}
                        onRowClick={onRowClick}
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
 * Creates the Header
 * @param {object} props The sort properties defined above responsiveTable
 * fieldDefs
 * fieldDefMap
 * cellWidth
 * colors
 * sortProps
 * entities
 *
 */
const Header = ({
    fieldDefs,
    entityMaps,
    cellWidth,
    sortProps,
    entities,
    className,
}) => {
    const labelStyle = { width: cellWidth + '%' }

    const doSort = sortProps ? sortProps.doSort : undefined
    const sortColumn = sortProps ? sortProps.column : undefined
    const ascending = sortProps ? sortProps.ascending : undefined

    return (
        <div className={className}>
            {fieldDefs.map((fieldDef, index) => {
                if (doSort && sortColumn === index) {
                    if (ascending) {
                        return (
                            <div
                                style={labelStyle}
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
                                <span className="fas fa-caret-down fa-lg"></span>
                            </div>
                        )
                    } else {
                        return (
                            <div
                                style={labelStyle}
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
                                <span className="fas fa-caret-up fa-lg"></span>
                            </div>
                        )
                    }
                } else {
                    return (
                        <div
                            style={labelStyle}
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
                }
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
    } else if (type === fieldType.SELECT_ENTITY) {
        // "Foreign" entities are represented by id rather than display value, so look up the value
        const id = value[fieldName]
        return id ? entityMap.entities[id][entityMap.displayField] : ''
    } else {
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
const Row = (props) => {
    return (
        <div className={props.className}>
            {props.fieldDefs.map((fieldDef, index) => {
                return (
                    <StyledCell
                        width={props.cellWidth}
                        colors={props.colors}
                        primary={props.primary === index}
                        key={index}
                    >
                        <CollapsedLabel>{fieldDef.label}</CollapsedLabel>
                        <CellContent
                            value={props.entity[fieldDef.name]}
                            type={fieldDef.type}
                            entityMap={
                                props.entityMaps
                                    ? props.entityMaps[fieldDef.name]
                                    : null
                            }
                            onRowClick={(e) =>
                                props.onRowClick(
                                    e,
                                    props.rowIndex,
                                    props.entity
                                )
                            }
                        ></CellContent>
                    </StyledCell>
                )
            })}
        </div>
    )
}

const StyledRow = styled(Row)`
    display: flex;
    padding: 0.2em;
    color: ${(props) => props.colors.rowText};
    background-color: ${(props) =>
        props.striped ? props.colors.rowStripe : props.colors.rowBg};
    @media all and (max-width: 768px) {
        flex-direction: column;
    }
`
const Cell = ({ className, children }) => {
    return <div className={className}>{children}</div>
}

const StyledCell = styled(Cell)`
    overflow: hidden;
    max-height: 1.5em;
    width: ${(props) => props.width + '%'};
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
const UnstyledCellContent = (props) => {
    if (props.type === fieldType.URL) {
        const url = props.value.startsWith('http')
            ? props.value
            : 'http://' + props.value
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                {props.value.slice(0, MAX_DISPLAY_URL)}
            </a>
        )
    } else if (props.type === fieldType.DATE) {
        // Convert from ISO format
        const reformatted = props.value
            ? moment(new Date(props.value)).format('ddd, MMM Do YYYY')
            : ''
        return <span onClick={props.onRowClick}>{reformatted}</span>
    } else if (props.type === fieldType.DATE_TIME) {
        // Convert from ISO format
        const reformatted = props.value
            ? moment(new Date(props.value)).format('ddd, MMM Do YYYY, h:mm a')
            : ''
        return <span onClick={props.onRowClick}>{reformatted}</span>
    } else if (props.type === fieldType.SELECT_ENTITY) {
        const displayValue = props.value
            ? props.entityMap.entities[props.value][
                  props.entityMap.displayField
              ]
            : ''
        return <span onClick={props.onRowClick}>{displayValue}</span>
    } else if (props.type === fieldType.EMAIL) {
        let displayValue
        if (props.value) {
            if (
                Object.getOwnPropertyNames(props.value).find(
                    (name) => name === 'address'
                )
            ) {
                //Single email, not an array
                displayValue = props.value.address
            } else {
                displayValue =
                    props.value[0].address +
                    (props.value.length > 1
                        ? `, ...${props.value.length - 1} more`
                        : '')
            }
        } else {
            displayValue = ''
        }
        return <span onClick={props.onRowClick}>{displayValue}</span>
    } else if (
        props.type === fieldType.TEXT ||
        props.type === fieldType.TEXT_AREA
    ) {
        return (
            <span onClick={props.onRowClick}>
                {props.value.slice(0, MAX_DISPLAY_TEXT)}
            </span>
        )
    } else {
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
export default responsiveTable
