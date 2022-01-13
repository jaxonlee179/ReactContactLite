/**
 * A simple unlabelled checkbox component
 */

import React from 'react'

const checkbox = ({checked, onChange}) => { 
    return <input type='checkbox' onChange={onChange} checked={checked}/>
}

export default checkbox
