/**
 * A responsive form component for creating or editing an entity,
 * Properties:
 * entity           a new unpopulated entity or an existing one 
 * isNew            if true, the entity is new (i.e. unpopulated)
 * propertyClass    name of the entity type
 * closeForm                
 * fieldDefs        array of {label, name, type} defining the entity attributes
 * isReadOnly       if true, all fields are read only
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from 'react-bootstrap';
import Selector from './Selector';

export const fieldType = {
    'TEXT':         'TEXT', 
    'TEXT_AREA':    'TEXT_AREA', 
    'DATE_TIME':    'DATE_TIME', 
    'DATE':         'DATE', 
    'URL':          'URL', 
    'SELECT_ENTITY':'SELECT_ENTITY',
    'SELECT':       'SELECT'}

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
        const title = this.props.isreadOnly ? this.props.entityClass :
            this.props.isNew ? `New ${this.props.entityClass}` : `Edit ${this.props.entityClass}`
        return (
            <Modal show={true} >
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
                                    label={field.label} 
                                    type={field.type} 
                                    value={value}
                                    options={options}
                                    onChange={this.onChange}
                                    key={index} />
                            }
                            else {
                                return <StyledRow name={field.name} 
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
                    <Button size="sm" variant="secondary" onClick={this.save}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const Form = styled.div`
    border: none;
`

const Row = props => {
    return (
        <div className={props.className}>
            <StyledLabel label={props.label}/>
            <StyledField type={props.type} name={props.name} value={props.value} options={props.options} onChange={props.onChange} isReadOnly={props.isReadOnly}/>
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
                    <input type='text' disabled={props.isReadOnly ? 'true' : 'false'} onChange={props.onChange} id={props.name} name={props.name} value={props.value} style={style}></input>
                </div>
            )

        case fieldType.TEXT_AREA:   
            return <div className={props.className}><textarea onChange={props.onChange} id={props.name} name={props.name} value={props.value} style={style}></textarea></div>
        
        case fieldType.DATE_TIME:
        case fieldType.DATE:    
            const theDate = props.value ? new Date(props.value) : null
            return (
                <div className={props.className}>
                    <DatePicker 
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
            return <div className={props.className}><Selector name={props.name} value={props.value} options={props.options} onChange={props.onChange}/></div>

        default: return <div>FUBAR</div>
    }
}

const StyledField = styled(Field)`
    width: 70%;
    @media all and (max-width: 768px) {
        width: 100%;;
    }
`

export { ResponsiveForm, StyledRow, StyledField }