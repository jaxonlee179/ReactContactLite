import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Company from './Company';
import * as actions from './CompanyActions';


class CompanyList extends Component {
    
    state = {}
    
    constructor (props){
        super(props);
 
        this.fieldOrder = ['name', 'url', 'address', 'city', 'phone']
        this.labels = ['Name', 'URL', 'Address', 'City', 'Phone']
        
        this.state = {
            column: undefined,     
            ascending: undefined,
            displayForm: false,

        }
        this.select= this.select.bind(this);
        this.createNew= this.createNew.bind(this);
        this.closeForm= this.closeForm.bind(this);
    }

    sort = (column, ascending) => {
        const sorted = [...this.props.companies].sort( (a, b) => {
            return ascending ? -a[this.fieldOrder[column]].localeCompare(b[this.fieldOrder[column]]) 
            : a[this.fieldOrder[column]].localeCompare(b[this.fieldOrder[column]])
        })
        this.props.storeAll(sorted)
        
        this.setState( {
            ...this.state,
            column,
            ascending
        })
    }
    /**
     * Displays the popup to create a new company
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} company the full MongoDB company object retrieved from the server
     */
    select(e, selectedRow, company){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            company
        })
    }

    // displayForm(company){
    //     this.setState({
    //         ...this.state,
    //         displayForm: true,
    //         company
    //     })
    // }

    closeForm(company){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (company) {
            this.props.saveCompany(company, this.state.selectedRow)
        }    
    }

    render() {

        const sortProps = {
            doSort: this.sort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        const urlColumns = [1]   
        return (
            <div>
                <ListHeaderFooter header='true' name='Companies' label='New Company' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.companies}
                    labels={this.labels}
                    fieldOrder={this.fieldOrder}
                    colors={colors}
                    sortProps={sortProps}
                    urlColumns={urlColumns}
                    onRowClick={this.select}
                    hasAppendedObject='true'/>
                {this.state.displayForm ? <Company company={this.state.company} closeForm={this.closeForm}></Company> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveCompany: (company, selectedRow) => dispatch(actions.saveCompany(company, selectedRow)),
        storeAll: (companies) => dispatch( { type: actions.STORE_ALL, companies})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
