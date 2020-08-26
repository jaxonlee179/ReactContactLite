/**
 * A modal popup for creating or viewing a company
 */
import React, { Component } from 'react';
import { Modal, Panel, Button } from 'react-bootstrap';
import * as actions from './CompanyActions';
import { connect } from 'react-redux';

class Company extends Component {

    state = {}

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    save() {

    }

    cancel(){

    }

    render() {
        return (
            <Modal show='props.show' onHide={this.cancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.new ? 'New Company' : 'Edit Company'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.save}>Save</Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>  
        )
    } 
}
const mapDispatchToProps = dispatch => {
    return {
        saveCompany: user => dispatch({ type: actions.SAVE_COMPANY, user }),
    };
};

export default connect(null, mapDispatchToProps)(Company)