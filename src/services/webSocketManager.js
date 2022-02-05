/**
 * Holds the websocket connection 
 */
const webSocketManager = {
    
    socket: undefined,
    
    /**
     * Stores the socket object
     */
    registerWebSocket(socket){
        console.log('Registered websocket')
        this.socket = socket
    },

    /**
     * Pushes an event to the client
     * @param {string} eventId the event id
     * @param {*} data the event data
     */
    pushToClient(eventId, data)  {
        console.log('Push to client: ' + eventId)
        this.socket.emit(eventId, data)
    }
}

module.exports = webSocketManager