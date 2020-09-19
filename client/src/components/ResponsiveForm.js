/**
 * A responsive form component,
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import TimePicker from 'basic-react-timepicker';
import { Modal, Button } from 'react-bootstrap';

export const fieldType = {'TEXT': 'TEXT', 'TIME': 'TIME', 'DATE': 'DATE'}

const Form = styled.div`
    border: none;
`
const Row = props => {
    return (
        <div className={props.className}>
            <StyledLabel label={props.label}/>
            <StyledField type={props.type} name={props.name} value={props.value} onChange={props.onChange}/>
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
        case fieldType.TEXT: return <div className={props.className}><input type='text' onChange={props.onChange} id={props.name} name={props.name} value={props.value} style={style}></input></div>
        case fieldType.DATE: return <div className={props.className}><DatePicker name={props.name} defaultValue={props.value}/></div>
        default: return <div>FUBAR</div>
    }
}
const StyledField = styled(Field)`
    width: 70%;
    @media all and (max-width: 768px) {
        width: 100%;;
    }
`
class ResponsiveForm extends Component{

    state = {}
    
    constructor(props){
        super(props)
        this.state.entity = {...props.entity}
        
        this.save= this.save.bind(this);
        this.cancel= this.cancel.bind(this);
        this.onChange = this.onChange.bind(this)
    }

    save(){
        this.props.closeForm(this.state.entity)
    }
    cancel(){
        this.props.closeForm()
    }
    onChange(e){
        const entity = {...this.state.entity}
        entity[e.target.name] = e.target.value
        this.setState({
            ...this.state,
            entity
        })
    }

    render(){
        return (
            <Modal show='true' >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.new ? 'New Company' : 'Edit Company'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {this.props.fieldDefs.map((field, index) => {
                            return <StyledRow name={field.name} 
                                label={field.label} 
                                type={field.type} 
                                value={this.state.entity[field.name]} 
                                readOnly={this.props.readOnly}
                                onChange={this.onChange}
                                key={index} />
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.save}>Save</Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ResponsiveForm