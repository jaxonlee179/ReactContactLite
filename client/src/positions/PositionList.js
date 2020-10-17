import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/ResponsiveTable';
import ListHeaderFooter from '../components/ListHeaderFooter';
import Position, { fieldDefs } from './Position';
import * as actions from './PositionActions';


class PositionList  extends Component {

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
     * Displays the popup to create a new position
     */
    createNew(){
        this.setState({
            ...this.state,
            selectedRow: null,
            displayForm: true,
            position: null
        })
    }

    /**
     * Responds to mouse click anywhere on the row except url fields
     * @param {object} e the click event object
     * @param {number} selectedRow display index of the row object
     * @param {object} position the full MongoDB position object retrieved from the server
     */
    select(e, selectedRow, position){
        this.setState({
            ...this.state,
            selectedRow,
            displayForm: true,
            position
        })
    }

    closeForm(position){
        this.setState({
            ...this.state,
            displayForm: false
        })
        if (position) {
            this.props.savePosition(position, this.state.selectedRow)
        }    
    }

    render() {

        const sortProps = {
            afterSort: this.afterSort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const entityMaps = {
            'company':  {entities: this.props.companiesMap, displayField: 'name'},
            'person':   {entities: this.props.personsMap,   displayField: 'name'}
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color
        return (
            <div>
                <ListHeaderFooter header='true' name='Positions' label='New Position' createNew={this.createNew}/>
                <ResponsiveTable 
                    entities={this.props.positions}
                    entityMaps={entityMaps}
                    fieldDefs={fieldDefs}
                    colors={colors}
                    sortProps={sortProps}
                    onRowClick={this.select}/>
                {this.state.displayForm ? <Position entity={this.state.position} closeForm={this.closeForm}></Position> : ''}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        positions: state.positionReducer.positions,
        companiesMap: state.companyReducer.companiesMap,
        personsMap: state.personReducer.personsMap
    }
}

const mapDispatchToProps = dispatch => {
    return {
        savePosition: (position, selectedRow) => dispatch(actions.savePosition(position, selectedRow)),
        storeAll: (positions) => dispatch( { type: actions.STORE_ALL, positions})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PositionList);
