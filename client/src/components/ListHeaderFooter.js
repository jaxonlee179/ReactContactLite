/**
 * Displays a header or footer for the entity list components, with a left justified
 * entity type label (for a header only), and a right justified button for creating a new entity
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components'

/**
 * Constructor
 * @param {boolean} props.header    if true, both type label and button are display; otherwise only the button
 * @param {string} props.name       the type label
 * @param {boolean} props.readOnly  if true, button is not rendered, so the corresponding list is effectively "read only," i.e. cannot be added to
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
