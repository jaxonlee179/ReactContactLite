/**
 * Displays a header or footer for the entity list components, providing a button
 * for creating a new entity
 */
import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Constructor
 * @param {} props 
 */
const listHeaderFooter= props => {
     const style2= { 
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
      // {props.header ? <h1>{props.name}</h1> : ''}
    return (        
        <div style={style2}>
            {props.header ? <h4>{props.name}</h4> : ''}
            <Button type="button" className="btn btn-xs" onClick={props.createNew}>{props.label}</Button>
        </div>
    )
}

export default listHeaderFooter;
