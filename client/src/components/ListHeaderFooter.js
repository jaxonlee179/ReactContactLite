/**
 * Displays a header or footer for the entity list components, with a left justified
 * entity type label (for a header only), and a right justified button for creating a new entity
 */
import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

/**
 * Constructor
 * @param {boolean} header    if true, both type label and button are display; otherwise only the button
 * @param {string} name       the type label
 * @param {boolean} readOnly  if true, button is not rendered, so the corresponding list is effectively "read only," i.e. cannot be added to
 */
const listHeaderFooter = ({fieldDefs, header, name, label, toggleShowHidden, createNew, readOnly, showHidden}) => {
    // If the entity includes a 'hide' field, the table should display a 'Show Hidden' button
    let entitiesAreHideable;
    fieldDefs.forEach(fieldDef => {
        if (fieldDef.name === 'hide'){
            entitiesAreHideable = true;
        }
    })

    return (
        <StyledDiv>
            {header && <h4>{name}</h4>}
            {entitiesAreHideable && (
                <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={toggleShowHidden}
            >
                {showHidden ? 'Hide Hidden' : "Show Hidden"}
            </Button>
            )}
            {!readOnly &&
            (
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={createNew}
                >
                    {label}
                </Button>
            )}
        </StyledDiv>
    )
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    margin-bottom: 0.2em;
`
export default listHeaderFooter
