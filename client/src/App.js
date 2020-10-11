import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';
import { CircleSpinner } from "react-spinners-kit";

import AppointmentList from './appointments/AppointmentList';
import CompanyList from './companies/CompanyList';
import ContactList from './contacts/ContactList';
import PersonList from './persons/PersonList';
import PositionList from './positions/PositionList';

import * as appointmentActions from './appointments/AppointmentActions';
import * as companyActions from './companies/CompanyActions';
import * as contactActions from './contacts/ContactActions';
import * as personActions from './persons/PersonActions';
import * as positionActions from './positions/PositionActions';

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
            minHeight: '20px !important',
            maxHeight: '20px !important'    
        }
        return (
            <div className="App">
                <Navbar bg="dark" expand="md" variant="dark" style={navbarHeight}>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <Nav.Link href="/appointments">Appointments</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/contacts">Contacts</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/contacts">Persons</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/positions">Positions</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/companies">Companies</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>                    
                </Navbar>

                <div style={{height: '100%', paddingLeft: '0.5em', paddingRight: '0.5em'}}>{routes}</div>                               
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
        storeCompanies:     (companies)     => dispatch({ type: companyActions.STORE_ALL,         companies }),
        storeContacts:      (contacts)      => dispatch({ type: contactActions.STORE_ALL_CONTACTS,          contacts }),
        storePersons:       (persons)       => dispatch({ type: personActions.STORE_ALL_PERSONS,            persons }),
        storePositions:     (positions)     => dispatch({ type: positionActions.STORE_ALL_POSITIONS,        positions })
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
