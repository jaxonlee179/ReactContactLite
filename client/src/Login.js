import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

/**
 * A dialog for entering the application password
 * TODO: This is a primitive implementation for a single user. 
 * Consider adding guest acounts demonstrations
 */
class Login extends Component {

    state = {}

    constructor(props) {
        super(props)
        this.login = this.login.bind(this);
        this.onChange= this.onChange.bind(this);
        this.state = {password: '', message: ''}
    }

    login(){
        this.setState({message: ''})
        axios.post('/login', {password: this.state.password})
        .then( response =>{
            this.props.onAuthenticated();
        })
        .catch( error => {
            this.setState( {message: 'Ooops! Try again'})
        })
    }

    onChange(e) {
        this.setState({password: e.target.value})
    }

    render() {
        return (
            <Modal show={true} size='sm'>
                <Modal.Header>
                    <Modal.Title>Enter Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <input type='text' value={this.state.password} onChange={this.onChange}></input>
                        <div>{this.state.message}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.login}>Login</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default Login
