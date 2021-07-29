import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

/**
 * A dialog for entering the application password
 * TODO: This is a primitive implementation for a single user. 
 */
function Login({onAuthenticated}) {
    
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState('');

    const passwordRef = useRef();

    useEffect( () => {
        passwordRef.current.focus();
    }, [] )

    function sendPassword() {
        axios.post('/login', {password})
        .then( response =>{
            onAuthenticated();
        })
        .catch( error => {
            setMessage('Ooops! Try again')
        })
    }
    
    function onChange(e) {
        setPassword(e.target.value);
        setMessage(null)
    }
    
    return (
        <Modal show={true} size='sm'>
            <Modal.Header>
                <Modal.Title>Enter Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input ref={passwordRef} type='text' value={password} onChange={onChange}></input>
                <div>{message}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button size="sm" variant="secondary" onClick={sendPassword}>Login</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Login
