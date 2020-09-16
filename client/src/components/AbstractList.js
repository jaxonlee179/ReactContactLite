import React, { Component } from 'react';

/**
 * Base for all components implementing entity tables
 */
class AbstractList extends Component {

    constructor (props){
        super(props);
        this.fieldOrder = props.fieldOrder;
        this.labels = props.labels;
        this.sort = this.sort.bind(this);
    }

    /**
     * For each object in an array, given an array of property names, 
     * copy the object property values into an array in the specified order
     * @param {object} columnOrder array of property names
     * @param {object} dataArray the object array
     */
    applyColumnOrder = (columnOrder, dataArray) => {
        let sortedArray = [];
        dataArray.forEach( (object, index) => {
            const values = [];
            columnOrder.forEach((key) => {
                values.push(object[key]);
            })
            // Add the object as the last element
            values.push(object);
            sortedArray.push(values)
        })

        return sortedArray
    }

    sort = (column, ascending) => {
        const sortedData = this.sortByColumn(this.state.data, column, ascending);
        this.setState( {
            ...this.state,
            column,
            ascending,
            data: sortedData
        })
    }

    /**
     * Sort the table data
     * @param {object} data array of arrays containing table data
     * @param {number} column the index of the field on which to sort
     * @param {boolean} ascending determines the sort order
     */
    sortByColumn = (data, column, ascending) => {
        const sorted = [...data].sort( (a, b) => {
            return ascending ? -a[column].localeCompare(b[column]) : a[column].localeCompare(b[column])
        })
        return sorted
    }
    
}

export default(AbstractList)
