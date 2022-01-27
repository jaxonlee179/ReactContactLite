/**
 * Component to display a <textarea> element and an optional <button>
 * to expand the element height beyond the default value 
 */
import React, { useState } from 'react'

/**
 * 
 * @param {boolean}  readOnly 
 * @param {function} onChange handler for content change
 * @param {string}   name the entity attribute name for the field 
 * @param {string}   content the text content
 * @param {string}   defaultStyle initial style for the <textarea> 
 */
function TextArea ({readOnly, onChange, name, content, defaultStyle}) {

    const [expand, setExpand] = useState(false)
     
    const expandOrCollapse = () => {
        setExpand(!expand)
    }

    return (
        <div>
            <textarea
                disabled={readOnly ? 'disabled' : null}
                id={name}
                name={name}
                value={content}
                style={expand ? {...defaultStyle, height: '40em', overflow: 'auto', fontSize: 'small'} : defaultStyle}
                onChange={onChange}
            ></textarea>
            <input
                type="button"
                value={expand ? 'Collapse' : 'Expand'}
                onClick={expandOrCollapse}
            ></input>
        </div>
    )
}
 
export default TextArea