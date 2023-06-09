import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';
import { CircleSpinner } from "react-spinners-kit";

import AppointmentList from './appointments/AppointmentList';
import CompanyList from './companies/CompanyList';
import EncounterList from './encounters/EncounterList';
import PersonList from './persons/PersonList';
import PositionList from './positions/PositionList';
import EmailList from './emails/EmailList';
import Login from './Login'

import * as appointmentActions from './appointments/AppointmentActions';
import * as companyActions from './companies/CompanyActions';
import * as encounterActions from './encounters/EncounterActions';
import * as personActions from './persons/PersonActions';
import * as positionActions from './positions/PositionActions';
import * as emailActions from './emails/EmailActions';

import axios from 'axios';
import webSocketManager from './utilities/webSocketManager'

/**
 * The root component of the client application. It initially displays a popup for entry of the application password
 * while simultaneously fetching all the entities. If after authentication the fetches have not finished, 
 * displays a spinner. Upon fetch completion it displayes the application menu
 */
class App extends Component {

    state = {} 
    
    /**
     * Constructor
     * @param {object} the Redux store 
     */
    constructor({store}){
        super({store})

        // Set initial state
        let baseURI = document.baseURI // non IE only, otherwise use window.location.href
        if (baseURI.indexOf('localhost:3000')) {
            // Local development; no need for login
            this.state.authorized = true
        }
        this.state.loading = true

        // Create and initialize the WebSocket Manager. 
        // Save it for access from componentDidMount
        this.webSocketManager = webSocketManager()
        this.webSocketManager.initialize(baseURI, store)

        // Add axios interceptors
        axios.interceptors.request.use(
            (request) => {
                this.setState({
                    requestUrl: request.url,
                    requestData: request.data,
                })
                return request
            },
            (error) => {
                console.log(error)
                return Promise.reject(error)
            }
        )

        axios.interceptors.response.use(
            (response) => {
                return response
            },
            (error) => {
                console.log(error)
                if (error.response) {
                    if (
                        error.response.status !== 401 &&
                        error.response.status !== 403
                    ) {
                        alert(
                            'An error has occurred. Please report this information:\n' +
                                'Status = ' +
                                error.response.status +
                                '\nURL = ' +
                                this.state.requestUrl +
                                '\ndata = ' +
                                JSON.stringify(this.state.requestData)
                        )
                    }
                } else {
                    alert(
                        'There was a problem connecting to the server\n' +
                            'Try closing your browser and try again'
                    )
                }
                return Promise.reject(error)
            }
        )
        this.onAuthenticated = this.onAuthenticated.bind(this)
    }

    componentDidMount() {
        Promise.all([
            axios.get('/appointments'),
            axios.get('/companies'),
            axios.get('/encounters'),
            axios.get('/persons'),
            axios.get('/positions'),
            axios.get('/emails')
        ]).then(([
            appointments,
            companies,
            encounters,
            persons,
            positions,
            emails
        ]) => {
            this.props.storeAppointments(appointments.data);
            this.props.storeCompanies(companies.data);
            this.props.storeEncounters(encounters.data);
            this.props.storePersons(persons.data);
            this.props.storePositions(positions.data);
            this.props.storeEmails(emails.data);
        })
        .then(() => {
            this.setState({loading: false});
            // Open the web socket to receive new emails arriving at the server
            this.webSocketManager.openSocket()
        })
        .catch(error => {
            console.log(error);
        })
    }

    onAuthenticated(){
        this.setState({authorized: true});
    }

    render() { 
        const showSpinner = this.state.loading && this.state.authorized;
        const showLogin = !this.state.authorized     
        // Display spinner until all required data are obtained from the server 
        if (showSpinner){
            return <div className='centered'><CircleSpinner size={80} color="#686769" loading={this.state.loading}></CircleSpinner></div>
        }
        else if (showLogin){
            return <Login onAuthenticated={this.onAuthenticated}/>
        }

        const routes = (
            <>
                <Route path="/appointments" exact component={AppointmentList} />
                <Route path="/companies" exact component={CompanyList} />
                <Route path="/encounters" exact component={EncounterList} />
                <Route path="/persons" exact component={PersonList} />
                <Route path="/positions" exact component={PositionList} />
                <Route path="/emails" exact component={EmailList} />
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
                            <LinkContainer to="/appointments">
                                <Nav.Link>Appointments</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/encounters">
                                <Nav.Link>Encounters</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/persons">
                                <Nav.Link>Persons</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/positions">
                                <Nav.Link>Positions</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/companies">
                                <Nav.Link>Companies</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/emails">
                                <Nav.Link>Emails</Nav.Link>
                            </LinkContainer>

                        </Nav>
                    </Navbar.Collapse>                    
                </Navbar>

                <div style={{height: '100%', paddingLeft: '0.5em', paddingRight: '0.5em'}}>{routes}</div>                               
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeAppointments:  (appointments)  => dispatch({ type: appointmentActions.STORE_ALL,   appointments }),
        storeCompanies:     (companies)     => dispatch({ type: companyActions.STORE_ALL,       companies }),
        storeEncounters:    (encounters)    => dispatch({ type: encounterActions.STORE_ALL,     encounters }),
        storePersons:       (persons)       => dispatch({ type: personActions.STORE_ALL,        persons }),
        storePositions:     (positions)     => dispatch({ type: positionActions.STORE_ALL,      positions }),
        storeEmails:        (emails)        => dispatch({ type: emailActions.STORE_ALL,         emails })
    }
}

export default withRouter(connect(null, mapDispatchToProps)(App));

