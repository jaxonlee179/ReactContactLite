import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import AbstractList from '../components/AbstractList';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Company from './Company';

class CompanyList extends AbstractList {
    
    state = {}
    
    constructor (props){
        super({
            ...props,
            fieldOrder : ['name', 'url', 'address', 'city', 'phone'],
            labels: ['Name', 'URL', 'Address', 'City', 'Phone']
        });
        
        const orderedData = this.applyColumnOrder(this.fieldOrder, props.companies)

        this.state = {
            column: undefined,     
            ascending: undefined,
            data: orderedData,
            display: false
        }
        this.selectCompany= this.selectCompany.bind(this);
        this.createNew= this.createNew.bind(this);
    }

    /**
     * Displays the popup to creatre a new company
     */
    createNew(){
        this.displayCompanyForm()
    }

    /**
     * Responds to mouse click anywhere on the row expect url fields
     * @param {object} e the click event object
     * @param {number} rowIndex display index of the row object
     * @param {object} company the full MongoDB company object retrieved from the server
     */
    selectCompany(e, rowIndex, company){
        this.displayCompanyForm(company)
    }

    displayCompanyForm(company){
        this.setState({
            ...this.state,
            display: true,
    /*        new: false,*/
            company
        })
    }

    render() {
        const sortProps = {
            doSort: this.sort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        const urlColumns = [1]   
        // new={this.state.new} 
        return (
            <div>
                <ListHeaderFooter header='true' name='Companies' label='New Company' createNew={this.createNew}/>
                <ResponsiveTable 
                    data={this.state.data}
                    labels={this.labels}
                    colors={colors}
                    sortProps={sortProps}
                    urlColumns={urlColumns}
                    onRowClick={this.selectCompany}
                    hasAppendedObject='true'/>
                {this.state.display ? <Company company={this.state.company}></Company> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        companies: state.companyReducer.companies
    }
}

export default connect(mapStateToProps)(CompanyList);
