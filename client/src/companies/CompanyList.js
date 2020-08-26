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
            data: orderedData
        }
        this.handleClick= this.handleClick.bind(this);
    }

    /**
     * Responds to mouse click on non URL fields
     * @param {object} e the click event object
     * @param {number} rowIndex 
     */
    handleClick(e, rowIndex){
        console.log(e)
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
                <ListHeaderFooter header='true' name='Companies' label='New Company'/>
                <ResponsiveTable data={this.state.data} labels={this.labels} sortProps={sortProps} colors={colors} urlColumns={urlColumns} onRowClick={this.handleClick}/>
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
