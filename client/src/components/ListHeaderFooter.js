/**
 * Displays a header or footer for the entity list components, providing a button
 * for creating a new entity
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components'

/**
 * Constructor
 * @param {} props 
 */
const listHeaderFooter= (props, className) => {
    return (        
        <StyledDiv>
            {props.header ? <h4>{props.name}</h4> : ''}
            {props.readOnly ? '' :
                <Button className={className} type="button" size="sm" variant="secondary" onClick={props.createNew}>{props.label}</Button>
            }
        </StyledDiv>
    )
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    margin-bottom: 0.2em;
`
export default listHeaderFooter;
