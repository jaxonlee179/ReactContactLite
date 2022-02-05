/**
 * Manages the WebSocket connection, and dispatches received email 
 * and encounter entities in the redux store
 */
import io from 'socket.io-client';
import { STORE_ONE as STORE_ONE_EMAIL } from '../emails/EmailActions'
import { STORE_ONE as STORE_ONE_ENCOUNTER } from '../encounters/EncounterActions'

export default function webSocketManager () {

    function initialize(baseURI, reduxStore){
        this.baseURI = baseURI
        this.reduxStore = reduxStore
    }

    function openSocket(){
        this.socket = io(this.baseURI)
        this.socket.__reduxStore = this.reduxStore
        this.socket.on('email', storeEmail)
        this.socket.on('encounter', storeEncounter)
    }

    function storeEmail(email){
        this.__reduxStore.dispatch({ type: STORE_ONE_EMAIL, data: {email} });
    }

    function storeEncounter(encounter){
        this.__reduxStore.dispatch({ type: STORE_ONE_ENCOUNTER, data: {encounter} });
    }

    return {
        initialize: initialize, 
        openSocket: openSocket
    }
}
