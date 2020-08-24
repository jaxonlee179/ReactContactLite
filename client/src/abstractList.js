import React, { Component } from 'react';

class AbstractList extends Component {

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
            sortedArray.push(values)
        })

        return sortedArray
    }

    sortByColumn = (data, column, ascending) => {
        const sorted = [...data].sort( (a, b) => {
            return ascending ? -a[column].localeCompare(b[column]) : a[column].localeCompare(b[column])
        })
        return sorted
    }
    
}

export default(AbstractList)
