/**
 * A responsive form component for creating or editing an entity, displayed as a modal popup. 
 * Properties:
 * {object}     entity          a new unpopulated entity or an existing one
 * {array}      optionSets      each element defined the options for entity fields of type SELECT or SELECT_ENTITY 
 * {function}   closeForm       callback function for Save and Cancel buttons
 * {boolean}    readOnly        if true, fields are read only
 * {string}     entityClass     the entity type (capitalized for display)              
 * {boolean}    isNew           if true, the entity is new (i.e. unpopulated)
 * {number}     width           optional Bootstrap width, defaults to 'md'
 * {array}      fieldDefs       array of {label, name, type} defining the entity attributes
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from 'react-bootstrap';
import Selector from './Selector';

export const fieldType = {
    'TEXT':         'TEXT',         // Specifies HTML input element of type 'text'
    'TEXT_AREA':    'TEXT_AREA',    // Specifies HTML textarea element 
    'DATE_TIME':    'DATE_TIME',    // Specifies DatePicker with time select
    'DATE':         'DATE',         // Specifies DatePicker without time select 
    'URL':          'URL',          // Specifies a link element
    'SELECT_ENTITY':'SELECT_ENTITY',// Specifies a selector displaying a set of entities
    'SELECT':       'SELECT',       // Specifies a set of options
    'EMAIL':        'EMAIL',        // Valid only if readOnly
    'ATTACHMENT':   'ATTACHMENT'    // Valid only if readOnly TODO
}

class ResponsiveForm extends Component{

    state = {}
    valueToLabelMaps = {}
    
    constructor(props){
        super(props)
        this.state.entity = {...props.entity}
        
        this.save= this.save.bind(this);
        this.cancel= this.cancel.bind(this);
        this.onChange = this.onChange.bind(this)

        const selectorNames = this.props.optionSets ? Object.keys(this.props.optionSets) : null
        if (selectorNames){
            selectorNames.forEach ( selectorName => {
                const options = this.props.optionSets[selectorName];
                this.valueToLabelMaps[selectorName]= options.reduce((map, option, index, options) => {
                    map[option.value] = index;
                    return map
                }, {})
            })
            console.log(this.valueToLabelMaps)
        }
    }

    save(){
        this.props.closeForm(this.state.entity)
    }
    cancel(){
        this.props.closeForm()
    }
    onChange(e){
        const entity = {...this.state.entity}
        if (e.target){ 
            entity[e.target.name] = e.target.value
        }
        else if (e.date){
            entity[e.name] = e.date
        }
        else { // Selector event is not a conventional control event, i.e. no "target" attribute
            entity[e.name] = e.value
        }
        this.setState({
            ...this.state,
            entity
        })
    }

    render(){
        const title = this.props.readOnly ? this.props.entityClass :
            this.props.isNew ? `New ${this.props.entityClass}` : `Edit ${this.props.entityClass}`
        const bottomButtons = this.props.readOnly ?
            (<Button size="sm" variant="secondary" onClick={this.cancel}>Close</Button>)
            :
            (<>
                <Button size="sm" variant="secondary" onClick={this.save}>Save</Button>
                <Button size="sm" variant="secondary" onClick={this.cancel}>Cancel</Button>
            </>)
        return (
            <>
            <Modal show={true} size={this.props.width ? this.props.width : 'md'}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {this.props.fieldDefs.map((field, index) => {
                            if (field.type === 'SELECT_ENTITY' || field.type === 'SELECT'){
                                const options = this.props.optionSets[field.name]
                                const value = this.state.entity[field.name] ? options[this.valueToLabelMaps[field.name][this.state.entity[field.name]]] : null
                                return <StyledRow name={field.name}
                                    readOnly = {this.props.readOnly} 
                                    label={field.label} 
                                    type={field.type} 
                                    value={value}
                                    options={options}
                                    onChange={this.onChange}
                                    key={index} />
                            }
                            else {
                                return <StyledRow name={field.name} 
                                    readOnly = {this.props.readOnly}
                                    label={field.label} 
                                    type={field.type} 
                                    value={this.state.entity[field.name]}
                                    onChange={this.onChange}
                                    key={index} />
                            }
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {bottomButtons}
                </Modal.Footer>
            </Modal>

            </>
        )
    }
}

const Form = styled.div`
    border: none;
`

const Row = props => {
    return (
        <div className={props.className}>
            {props.label ? <>
                <StyledLabel label={props.label}/>
                <StyledField type={props.type} name={props.name} value={props.value} options={props.options} onChange={props.onChange} readOnly={props.readOnly}/>
            </> :  
                <StyledFieldWithoutLabel type={props.type} name={props.name} value={props.value} options={props.options} onChange={props.onChange} readOnly={props.readOnly}/>
            }
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

const Label = props => {
    return <div className={props.className}>{props.label}</div>
}
const StyledLabel = styled(Label)`
    width: 30%;
    @media all and (max-width: 768px) {
        width: 100%;;
    }
`

const Field = props => {
    const style={width:'100%'}
    switch (props.type) {
        case fieldType.TEXT: 
        case fieldType.URL: 
            return (
                <div className={props.className}>
                    <input type='text' disabled={props.readOnly ? 'disabled' : null} onChange={props.onChange} 
                    id={props.name} name={props.name} value={props.value} style={style}></input>
                </div>
            )

        case fieldType.EMAIL:
            const value = props.readOnly ? formatEmailObject(props.value) : props.value;
            return (
                <div className={props.className}>
                    <input type='email' disabled={props.readOnly ? 'disabled' : null} onChange={props.onChange} 
                    id={props.name} name={props.name} value={value} style={style}></input>
                </div>
            )

        case fieldType.TEXT_AREA:   
            return (
                <div className={props.className}>
                    <textarea disabled={props.readOnly ? 'disabled' : null} onChange={props.onChange} id={props.name} 
                    name={props.name} value={props.value} style={style}></textarea>
                </div>
            )
        
        case fieldType.DATE_TIME:
        case fieldType.DATE:    
            const theDate = props.value ? new Date(props.value) : null
            return (
                <div className={props.className}>
                    <DatePicker
                        disabled={props.readOnly ? 'disabled': null}
                        selected={theDate} 
                        onChange={date => props.onChange({name: props.name, date: date})}
                        showTimeSelect={props.type === fieldType.DATE_TIME ? "true" : undefined}
                        isClearable 
                        timeFormat="HH:mm" 
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat={props.type === fieldType.DATE_TIME ? "yyyy/MM/dd h:mm aa" : "yyyy/MM/dd"} 
                        />
                </div>
            )

        case fieldType.SELECT:
        case fieldType.SELECT_ENTITY:  
            return (
                <div className={props.className}>
                    <Selector name={props.name} value={props.value} options={props.options} onChange={props.onChange}/>
                </div>
            )

        case fieldType.ATTACHMENT:
            const text = `${props.value.fileName};  ${props.value.contentType}` 
            return (
                 props.value.viewable ?
                    <div className={props.className} onClick={ e => props.value.onClick(props.value.url)}>{text}</div>
                    :
                    <a href={props.value.url}>{text}</a>
            )

        default: return <div>FUBAR</div>
    }
}

const formatEmailObject = email => {
    let value;
    if (Object.getOwnPropertyNames(email).find( name => name ==='address')){
        // Single { ?name, address }
        value = email.name ? email.name + ` <${email.address}>` : email.address;
    }
    else if (Object.getOwnPropertyNames(email).find( name => name ==='length')){
        // Array of { ?name, address}
        value = '';
        email.forEach( (em, i, email) => {
            value += em.name ? em.name + ` <${em.address}>` : em.address
                + (i < email.length - 1 ? ', ' : '');
        })
    }
    else {
        value = email;
    }
    return value;
}

const StyledField = styled(Field)`
    width: 70%;
    @media all and (max-width: 768px) {
        width: 100%;;
    }
`

const StyledFieldWithoutLabel = styled(Field)`
    width: 100%;
`

export default ResponsiveForm;