import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';
import { CircleSpinner } from "react-spinners-kit";

import AppointmentList from './appointments/appointmentList';
import CompanyList from './companies/companyList';
import ContactList from './contacts/contactList';
import PersonList from './persons/personList';
import PositionList from './positions/positionList';

import * as appointmentActions from './appointments/appointmentActions';
import * as companyActions from './companies/companyActions';
import * as contactActions from './contacts/contactActions';
import * as personActions from './persons/personActions';
import * as positionActions from './positions/positionActions';

import axios from 'axios';


/**
 * The root component of the application. 
 */
class App extends Component {

    state = {
        loading: undefined
    };

    constructor(props) {
        super(props);
        // Add axios interceptors
        axios.interceptors.request.use(request => {
            this.setState({
                requestUrl: request.url,
                requestData: request.data
            });
            return request;
        }, error => {
            console.log(error);
            return Promise.reject(error);
        });

        this.state.loading = true;
    }

    componentDidMount() {
        Promise.all([
            axios.get('/appointments'),
            axios.get('/companies'),
            axios.get('/contacts'),
            axios.get('/persons'),
            axios.get('/positions'),
            // axios.get('/emails')
        ]).then(([
            appointments,
            companies,
            contacts,
            persons,
            positions
            // emails
        ]) => {
            this.props.storeAppointments(appointments.data);
            this.props.storeCompanies(companies.data);
            this.props.storeContacts(contacts.data);
            this.props.storePersons(persons.data);
            this.props.storePositions(positions.data);
            // this.props.storeEmails(emails.data);
            })
        .then(() => {
            this.setState({loading: false});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {      
        // Display spinner until all required data are obtained from the server 
        if (this.state.loading){
            return (
                <div className='spinner-container'>
                    <CircleSpinner size={80} color="#686769" loading={this.state.loading}></CircleSpinner>
                </div>
            )
        }

        const routes = (
            <>
                <Route path="/appointments" exact component={AppointmentList} />
                <Route path="/companies" exact component={CompanyList} />
                <Route path="/contacts" exact component={ContactList} />
                <Route path="/persons" exact component={PersonList} />
                <Route path="/positions" exact component={PositionList} />
            </>
        );
        const navbarHeight = {
            minHeight: '40px !important',
            maxHeight: '40px !important'    
        }
        return (
            <div className="App">
                <Navbar collapseOnSelect style={navbarHeight}>
                    <Navbar.Header>                        
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                        
                            <LinkContainer to="/appointments">
                                <NavItem>Appointments</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/contacts">
                                <NavItem>Contacts</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/persons">
                                <NavItem>Persons</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/positions">
                                <NavItem>Positions</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/companies">
                                <NavItem>Companies</NavItem>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>                    
                </Navbar>

                <div style={{height: '100%'}}>{routes}</div>                               
            </div>
        );
    }
}

const navbarHeight = {
    minHeight: '40px !important',
    maxHeight: '40px !important'    
}

const mapStateToProps = state => {
    return {
/*        loggedInUser: state.userReducer.loggedInUser,*/
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeAppointments:  (appointments)  => dispatch({ type: appointmentActions.STORE_ALL_APPOINTMENTS,  appointments }),
        storeCompanies:     (companies)     => dispatch({ type: companyActions.STORE_ALL_COMPANIES,         companies }),
        storeContacts:      (contacts)      => dispatch({ type: contactActions.STORE_ALL_CONTACTS,          contacts }),
        storePersons:       (persons)       => dispatch({ type: personActions.STORE_ALL_PERSONS,            persons }),
        storePositions:     (positions)     => dispatch({ type: positionActions.STORE_ALL_POSITIONS,        positions })
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
