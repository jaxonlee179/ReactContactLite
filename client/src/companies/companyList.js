import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/responsiveTable';
import { sortByField } from '../components/utilities';
import AbstractList from '../abstractList';

class CompanyList extends AbstractList {
    state = {}
    // Define the column header labels 
    labels = ['Name', 'URL', 'Address', 'City', 'Phone'];
    
    constructor (props){
        super(props);

        const fieldOrder = ['name', 'url', 'address', 'city', 'phone']
        
        const orderedData = this.applyColumnOrder(fieldOrder, props.companies)

        this.state = {
            column: undefined,     
            ascending: undefined,
            data: orderedData
        }
        this.sort = this.sort.bind(this);
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

    render() {
        const sortProps = {
            doSort: this.sort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }    
        return (
            <>
            <h5> Companies</h5>
            <ResponsiveTable data={this.state.data} labels={this.labels} sortProps={sortProps}/>
            </>
        )
    }
}


const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies
    }
}


export default connect(mapStateToProps)(CompanyList);
