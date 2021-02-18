/**
* A wrapper for the React Select component (https://react-select.com/) providing a left side
* label and custom styling. 
* Additional props:
* name:                 an optional string passed to the selectHandler argument 'name'                
* label:                the control label
* options:              either an array [{label: string, value: object }], or an object 
*                       {'label': string, 'options': [{label: string, value: object }]} if options are to be grouped
* selectHandler:        function to receive the onChange event     
* value:                the current selected value
* placeholder:          optional placeholder
*/
import React from 'react';
import Select from 'react-select';

const valueContainer = (provided, state) => ({
    ...provided,
    padding : '0px 2px',
    maxHeight: '30px'
});
const indicatorContainer  = (provided, state) => ({
    ...provided,
    padding: '6px'
}); 
const indicatorSeparator  = (provided, state) => ({
    ...provided,
    marginBottom: '5px',
    marginTop: '5px'
}); 
const input = (provided, state) => ({
    ...provided,
    margin: '0px'
}); 
const control = (provided, state) => ({
    ...provided,
    border: '1px solid black',
    backgroundColor: 'inherit',
    color: '#2c3e50',
    maxHeight: '32px',
    minHeight: '30px'
});

const customStyles = {control, valueContainer, input, indicatorContainer, indicatorSeparator}

const onChange = ((event, props) => {
    event = {...event, name: props.name};
    props.onChange(event);
})

const selector = (props) => {    
    const component = (
        <Select
            options={props.options}
            placeholder={props.placeholder}
            onChange={event => { onChange(event, props) }}
            isDisabled={props.disabled}
            name={props.name}
            styles={customStyles}
            value={props.value}
        />
    )
    return (
        <div>
            <span>{props.label}</span>
            {component}
        </div>
    )
}
   
export default selector;
        