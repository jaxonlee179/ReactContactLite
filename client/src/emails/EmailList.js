/**
 * Am EmailList is a "read only" table of emails, either all those in the system,
 * or those sent by a specified Person
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Email, { fieldDefs } from './Email';

class EmailList  extends Component {

    state = {}

    constructor (props){
        super(props);
 
        this.state = {
            column: undefined,     
            ascending: undefined,
            displayForm: false
        }
        this.select= this.select.bind(this);
        this.closeForm= this.closeForm.bind(this);
    }

    afterSort = (sorted, column, ascending) => {
        this.props.storeAll(sorted)        
        this.setState( {
            ...this.state,
            column,
            ascending
        })
    }
    
    /**
     * Displays an email in a popup
     */
    showEmail(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            email: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} email the full MongoDB email object retrieved from the server
     */
    select(e, selectedRow, email){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            email
        })
    }

    closeForm(email){
        this.setState({
            ...this.state,
            displayForm: false
        })
    }

    render() {
//                    entityMaps={entityMaps}

        const sortProps = {
            afterSort: this.afterSort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color

        return (
            <div>
                <ListHeaderFooter header='true' name='Emails' label='Email' readOnly='true'/>
                <ResponsiveTable 
                    entities={this.props.emails}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}
                    readOnly='true'/>
                {this.state.displayForm ? <Email entity={this.state.email} closeForm={this.closeForm}></Email> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        emails: state.emailReducer.emails,
    }
}


export default connect(mapStateToProps)(EmailList);
