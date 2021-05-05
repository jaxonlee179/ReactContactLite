import React, {Component} from 'react';

/**
 * A high order component providing the buildOptionSets method, for assembling the options sets
 * for selection of of Entities.  
 * @param {object} WrappedComponent the component requiring option set support
 */
export default function withOptionSets(WrappedComponent){
    
    return class extends Component{

        constructor(props){
            super(props)
            this.state = {
                buildOptionSets: this.buildOptionSets
            }
        }

        /**
         * Assembles the set of selector option sets
         * @param {array} defs array of {mappedAttribute, type}
         */
        buildOptionSets(defs){
            const optionSets = {}
            defs.forEach( def => {
                let options = []
                def.entityList.forEach( entity => {
                    options.push({label: entity[def.mappedAttribute], value: entity._id})
                })
               optionSets[def.type] = options
            })
            return optionSets
        }

        render(){
            return (
                <div>
                    <WrappedComponent {...this.state} {...this.props}/>
                </div>
            );
        }
    } 
}

