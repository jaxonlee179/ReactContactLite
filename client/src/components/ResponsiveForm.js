/**
 * A responsive form component for creating, viewing or editing an entity, displayed as a modal popup.
 */
import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Modal, Button } from 'react-bootstrap'
import Selector from './Selector'
import TextArea from './TextArea'

export const fieldType = {
    TEXT:           'TEXT',         // Specifies HTML input element of type 'text'
    TEXT_AREA:      'TEXT_AREA',    // Specifies HTML textarea element
    DATE_TIME:      'DATE_TIME',    // Specifies DatePicker with time select
    DATE:           'DATE',         // Specifies DatePicker without time select
    URL:            'URL',          // Specifies a link element
    SELECT_ENTITY:  'SELECT_ENTITY',// Specifies a selector displaying a set of entities
    SELECT:         'SELECT',       // Specifies a set of options
    EMAIL:          'EMAIL',        // Valid only if readOnly
    ATTACHMENT:     'ATTACHMENT',   // Valid only if readOnly TODO
    BOOLEAN_HIDDEN: 'BOOLEAN_HIDDEN'// Not to be displayed in the form; it is displayed in <ResponsiveTable> as a checkbox 
}

// Display widths to apply to fields in the table view; not relevant for the form
// The values i.e. 1, 2, 3 will become the 'flex-grow' CSS attribute 
export const fieldWidth = {
    NARROW: 1,
    NORMAL: 2,
    WIDE:   3
}
/**
 * Generates the component
 * @param {object}     theEntity    an entity to be viewed or edited, or null
 * @param {string}     entityClass  the entity type (capitalized for display)
 * @param {array}      fieldDefs    array of {label, name, type} defining the entity attributes
 * @param {array}      optionSets   each element defined the options for entity fields of type SELECT or SELECT_ENTITY
 * @param {boolean}    readOnly     if true, fields are read only
 * @param {boolean}    isNew        if true, the entity is new (i.e. unpopulated)
 * @param {function}   closeForm    callback function for Save and Cancel buttons
 * @param {number}     width        optional Bootstrap width, defaults to 'md'
 * @returns the component
 */
function ResponsiveForm({
    theEntity,
    entityClass,
    fieldDefs,
    optionSets,
    readOnly,
    isNew,
    closeForm,
    width,
}) {
    const [entity, setEntity] = useState(theEntity ? theEntity : {})

    const valueToLabelMaps = useMemo(
        () => createMaps(optionSets),
        [optionSets]
    )

    function createMaps(optionSets) {
        const maps = {}
        if (optionSets) {
            const selectorNames = Object.keys(optionSets)
            selectorNames.forEach((selectorName) => {
                const options = optionSets[selectorName]
                maps[selectorName] = options.reduce(
                    (map, option, index, options) => {
                        map[option.value] = index
                        return map
                    },
                    {}
                )
            })
        }
        return maps
    }

    function save() {
        closeForm(entity)
    }
    function cancel() {
        closeForm()
    }
    function onChange(e) {
        if (e.target) {
            entity[e.target.name] = e.target.value
        } 
        else if (e.date) {
            entity[e.name] = e.date
        } 
        else {
            // Selector event is not a conventional control event, i.e. no "target" attribute
            entity[e.name] = e.value
        }
        setEntity({ ...entity })
    }

    function expandTextArea(e) {
        console.log(e);
    }

    const title = readOnly
        ? entityClass
        : isNew
        ? `New ${entityClass}`
        : `Edit ${entityClass}`
    const bottomButtons = readOnly ? (
        <Button size="sm" variant="secondary" onClick={cancel}>
            Close
        </Button>
    ) : (
        <>
            <Button size="sm" variant="secondary" onClick={save}>
                Save
            </Button>
            <Button size="sm" variant="secondary" onClick={cancel}>
                Cancel
            </Button>
        </>
    )

    return (
        <>
            <Modal show={true} size={width ? width : 'md'}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {fieldDefs.map((field, index) => {
                            if (field.name === 'hide'){
                                return null
                            }
                            else if (field.type === fieldType.SELECT_ENTITY || field.type === fieldType.SELECT) {
                                const options = optionSets[field.name]
                                let value = entity[field.name] &&
                                    options[
                                        valueToLabelMaps[field.name][
                                            entity[field.name]
                                        ]
                                    ]
                                return (
                                    <StyledRow
                                        name={field.name}
                                        readOnly={readOnly}
                                        label={field.label}
                                        type={field.type}
                                        value={value}
                                        options={options}
                                        onChange={onChange}
                                        key={index}
                                    />
                                )
                            } 
                            else {
                                return (
                                    <StyledRow
                                        name={field.name}
                                        readOnly={readOnly}
                                        label={field.label}
                                        type={field.type}
                                        value={entity[field.name]}
                                        onChange={onChange}
                                        key={index}
                                    />
                                )
                            }
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>{bottomButtons}</Modal.Footer>
            </Modal>
        </>
    )
}

const Form = styled.div`
    border: none;
`

const Row = ({
    name,
    readOnly,
    label,
    type,
    value,
    options,
    onChange,
    expandTextArea,
    key
}) => {
    return (
        <div>
            {label ? (
                <>
                    <StyledLabel label={label} />
                    <StyledField
                        type={type}
                        name={name}
                        content={value}
                        options={options}
                        onChange={onChange}
                        expandTextArea={expandTextArea}
                        readOnly={readOnly}
                    />
                </>
            ) : (
                <StyledFieldWithoutLabel
                    type={type}
                    name={name}
                    content={value}
                    options={options}
                    onChange={onChange}
                    expandTextArea={expandTextArea}
                    readOnly={readOnly}
                />
            )}
        </div>
    )
}
const StyledRow = styled(Row)`
    display: flex;
    padding: 0.2em;
    @media all and (max-width: 768px) {
        flex-direction: column;
    }
`
const Label = ({ className, label }) => {
    return <div className={className}>{label}</div>
}
const StyledLabel = styled(Label)`
    width: 30%;
    @media all and (max-width: 768px) {
        width: 100%;
    }
`

const Field = ({type, className, readOnly, onChange, name, content, options, expandTextArea}) => {
    const style = { width: '100%' }
    switch (type) {
        case fieldType.TEXT:
        case fieldType.URL:
            return (
                <div className={className}>
                    <input
                        type="text"
                        disabled={readOnly ? 'disabled' : null}
                        onChange={onChange}
                        id={name}
                        name={name}
                        value={content}
                        style={style}
                    ></input>
                </div>
            )

        case fieldType.EMAIL:
            const value = readOnly
                ? formatEmailObject(content)
                : content
            return (
                <div className={className}>
                    <input
                        type="email"
                        disabled={readOnly ? 'disabled' : null}
                        onChange={onChange}
                        id={name}
                        name={name}
                        value={value}
                        style={style}
                    ></input>
                </div>
            )

        case fieldType.TEXT_AREA:
           return <TextArea disabled={readOnly ? 'disabled' : null}
                        id={name}
                        name={name}
                        content={content}
                        defaultStyle={style}
                        onChange={onChange}/>


        case fieldType.DATE_TIME:
        case fieldType.DATE:
            const theDate = content ? new Date(content) : null
            return (
                <div className={className}>
                    <DatePicker
                        disabled={readOnly ? 'disabled' : null}
                        selected={theDate}
                        onChange={(date) =>
                            onChange({ name: name, date: date })
                        }
                        showTimeSelect={
                            type === fieldType.DATE_TIME
                                ? 'true'
                                : undefined
                        }
                        isClearable
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat={
                            type === fieldType.DATE_TIME
                                ? 'yyyy/MM/dd h:mm aa'
                                : 'yyyy/MM/dd'
                        }
                    />
                </div>
            )

        case fieldType.SELECT:
        case fieldType.SELECT_ENTITY:
            return (
                <div className={className}>
                    <Selector
                        name={name}
                        value={content}
                        options={options}
                        onChange={onChange}
                    />
                </div>
            )

        case fieldType.ATTACHMENT:
            const text = `${content.fileName};  ${content.contentType}`
            return content.viewable ? (
                <div
                    className={className}
                    onClick={(e) => content.onClick(content.url)}
                >
                    {text}
                </div>
            ) : (
                <a href={content.url}>{text}</a>
            )
        // Refer to ResponsiveTable for its use in that context 
        case fieldType.BOOLEAN_HIDDEN: return null
        
        default:
            return <div>FUBAR</div>
    }
}
const StyledField = styled(Field)`
    width: 70%;
    @media all and (max-width: 768px) {
        width: 100%;
    }
`
const StyledFieldWithoutLabel = styled(Field)`
    width: 100%;
`

const formatEmailObject = (emailArray) => {
    if (emailArray.length == 0){
        return null
    }
    const email = emailArray[0]
    let value
    if (Object.getOwnPropertyNames(email).find((name) => name === 'address')) {
        // Single { ?name, address }
        value = email.name ? email.name + ` <${email.address}>` : email.address
    } 
    else if (
        Object.getOwnPropertyNames(email).find((name) => name === 'length')
    ) {
        // Array of { ?name, address}
        value = ''
        email.forEach((em, i, email) => {
            value += em.name
                ? em.name + ` <${em.address}>`
                : em.address + (i < email.length - 1 ? ', ' : '')
        })
    } 
    else {
        value = email
    }
    return value
}

export default ResponsiveForm
