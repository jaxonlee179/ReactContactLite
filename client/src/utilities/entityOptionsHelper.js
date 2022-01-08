/**
 * Assembles the set of selector option sets
 * @param {array} optionDefinitions array of {entityList, type, mappedAttribute}
 */
const buildEntityOptionSets = (optionDefinitions) => {
    const optionSets = {}
    optionDefinitions.forEach(({ entityList, type, mappedAttribute }) => {
        let options = []
        entityList.forEach((entity) => {
            options.push({ label: entity[mappedAttribute], value: entity._id })
        })
        optionSets[type] = options
    })
    return optionSets
}

export default buildEntityOptionSets
