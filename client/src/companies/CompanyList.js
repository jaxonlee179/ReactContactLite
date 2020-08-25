import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { connect } from 'react-redux';
import ResponsiveTable from '../components/responsiveTable';
import AbstractList from '../components/abstractList';
import ListHeaderFooter from '../components/listHeaderFooter';

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
        this.showCompanyPopup= this.showCompanyPopup.bind(this);
    }

    showCompanyPopup(){

    }

    render() {
        const sortProps = {
            doSort: this.sort, 
            column: this.state.column, 
            ascending: this.state.ascending
        }
        const colors = {headerBg: '#2c3e50'} // Set to bootstrap-<them>.css body color    
        return (
            <div>
                <ListHeaderFooter header='true' name='Companies' label='New Company'/>
                <ResponsiveTable data={this.state.data} labels={this.labels} sortProps={sortProps} colors={colors} onClick={this.showCompanyPopup}/>
                <
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
        saveNewModeratorUser: user => dispatch({ type: actions.STORE_NEW_USER, user }),
        saveNewModerator: moderator => dispatch(actions.saveModerator(moderator)),
        changeModeratorStatus: moderator => dispatch(actions.changeModeratorStatus(moderator))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
