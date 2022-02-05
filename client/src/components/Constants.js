/**
 * Holds common field definitions
 */
 export const fieldType = {
    TEXT:           'TEXT',         // Specifies HTML input element of type 'text'
    TEXT_AREA:      'TEXT_AREA',    // Specifies HTML textarea element
    DATE_TIME:      'DATE_TIME',    // Specifies DatePicker with time select
    DATE:           'DATE',         // Specifies DatePicker without time select
    URL:            'URL',          // Specifies a link element
    SELECT_ENTITY:  'SELECT_ENTITY',// Specifies a selector displaying a set of entities
    SELECT:         'SELECT',       // Specifies a set of options
    EMAIL:          'EMAIL',        // Valid only if readOnly
    ATTACHMENT:     'ATTACHMENT',   // Valid only if readOnly TODO
    BOOLEAN_HIDDEN: 'BOOLEAN_HIDDEN'// Not to be displayed in the form; it is displayed in <ResponsiveTable> as a checkbox 
}

// Display widths to apply to fields in the table view; not relevant for the form
// The values i.e. 1, 2, 3 will become the 'flex-grow' CSS attribute 
export const fieldWidth = {
    NARROW: 1,
    NORMAL: 2,
    WIDE:   3
}
