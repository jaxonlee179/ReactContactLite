import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Encounter, { fieldDefs } from './Encounter';
import * as actions from './EncounterActions';

class EncounterList  extends Component {

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
     * Displays the popup to create a new encounter
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            encounter: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} encounter the full MongoDB encounter object retrieved from the server
     */
    select(e, selectedRow, encounter){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            encounter
        })
    }

    closeForm(encounter){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (encounter) {
            this.props.saveEncounter(encounter, this.state.selectedRow)
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
                <ListHeaderFooter header='true' name='Encounters' label='New Encounter' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.encounters}
                    entityMaps={entityMaps}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}/>
                {this.state.displayForm ? <Encounter entity={this.state.encounter} closeForm={this.closeForm}></Encounter> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        encounters: state.encounterReducer.encounters,
        positionsMap: state.positionReducer.positionsMap,
        personsMap: state.personReducer.personsMap
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveEncounter: (encounter, selectedRow) => dispatch(actions.saveEncounter(encounter, selectedRow)),
        storeAll: (encounters) => dispatch( { type: actions.STORE_ALL, encounters})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EncounterList);
