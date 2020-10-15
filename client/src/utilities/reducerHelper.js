/** Common methods for the reducers */
export const storeAll = (state, arrayName, mapName, entities) => {
    const newState = { ...state }
    let map = state[mapName]

    if (!map) {
        // Entities have just been retrieved from server
        newState[mapName] = entities.reduce((newMap, entity) => {
            newMap[entity._id] = entity
            return newMap
        }, {})
    }
    newState[arrayName] = entities;

    return newState
}

export const storeOne = (state, entity, rowIndex, arrayName, mapName) => {
    const newState = { ...state }
    const entities = [...state[arrayName]];
    if (rowIndex == null){
        entities.push(entity)
    }
    else {    
        entities[rowIndex] = entity
    }
    const map = {...state[mapName]};
    map[entity._id] = entity;

    newState[arrayName] = entities;
    newState[mapName] = map
    
    return newState
}
