/**
* A wrapper for the React Select component (https://react-select.com/) providing a left side
* label and custom styling. 
* Properties:
* {string} name:            a component identifier, added to the evnt object passed to the onChange handler                
* {string}label:            control label
* {*} options:              either an array [{label: string, value: object }], or an object 
*                           {'label': string, 'options': [{label: string, value: object }]} if options are to be grouped
* {function} onChange:      callback for the onChange event     
* {*} value:                the current selected value
* {boolean} disabled:       if true, the current value is displayed as read only
* {string} placeholder:     optional placeholder
*/
import React from 'react';
import Select from 'react-select';

// Custom styling: refer the "Style modifier methods" section at https://react-select.com/props#select-props
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
        