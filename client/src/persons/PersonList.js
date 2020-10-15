import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Person, { fieldDefs } from './Person';
import * as actions from './PersonActions';

class PersonList  extends Component {
    state = {}
    optionSets = {}

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

        this.optionSets = this.props.buildOptionSets([
            {entityList: this.props.companies, type: 'company'}
        ])

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
     * Displays the popup to create a new person
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            person: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} person the full MongoDB person object retrieved from the server
     */
    select(e, selectedRow, person){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            person
        })
    }

    closeForm(person){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (person) {
            this.props.savePerson(person, this.state.selectedRow)
        }    
    }

    render() {

        const sortProps = {
            afterSort: this.afterSort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        return (
            <div>
                <ListHeaderFooter header='true' name='Persons' label='New Person' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.persons}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}/>
                {this.state.displayForm ? <Person entity={this.state.person} closeForm={this.closeForm}></Person> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        persons: state.personReducer.persons,
        companies: state.companyReducer.companies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        savePerson: (person, selectedRow) => dispatch(actions.savePerson(person, selectedRow)),
        storeAll: (persons) => dispatch( { type: actions.STORE_ALL, persons})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonList);
