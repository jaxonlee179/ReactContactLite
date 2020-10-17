import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Contact, { fieldDefs } from './Contact';
import * as actions from './ContactActions';

class ContactList  extends Component {

    state = {}

    constructor (props){
        super(props);
 
        this.state = {
            column: undefined,     
            ascending: undefined,
            displayForm: false
        }
        this.select= this.select.bind(this);
        this.createNew= this.createNew.bind(this);
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
     * Displays the popup to create a new contact
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            contact: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} contact the full MongoDB contact object retrieved from the server
     */
    select(e, selectedRow, contact){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            contact
        })
    }

    closeForm(contact){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (contact) {
            this.props.saveContact(contact, this.state.selectedRow)
        }    
    }

    render() {

        const sortProps = {
            afterSort: this.afterSort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const entityMaps = {
            'position':  {entities: this.props.positionsMap, displayField: 'title'},
            'person':   {entities: this.props.personsMap,   displayField: 'name'},
         }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        return (
            <div>
                <ListHeaderFooter header='true' name='Contacts' label='New Contact' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.contacts}
                    entityMaps={entityMaps}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}/>
                {this.state.displayForm ? <Contact entity={this.state.contact} closeForm={this.closeForm}></Contact> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.contactReducer.contacts,
        positionsMap: state.positionReducer.positionsMap,
        personsMap: state.personReducer.personsMap
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveContact: (contact, selectedRow) => dispatch(actions.saveContact(contact, selectedRow)),
        storeAll: (contacts) => dispatch( { type: actions.STORE_ALL, contacts})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);
