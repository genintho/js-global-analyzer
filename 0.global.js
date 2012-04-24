/**
 * Js Global Analyzer
 *
 * A small utility module to help you watch the state of the global Namespace
 * @author Thomas Genin
 */
/**
 * @namespace
 */
GlobalAnalyzer = (function(){
    var snapshot = {};
    
    // at init take a snapshot
    for( var name in window ){
        snapshot[name] = true;
    }
    
    var savedStates = {};
    
    function _compareState( previousState ){
        var windowProp = [];
        var newItem = [];
        var remove = [];

        for( var name in window){
            windowProp.push( name );
            if( previousState[name] === undefined ){
                newItem.push( name );
            }
        }

        for( name in previousState ){
            if( windowProp.indexOf( name ) == -1 ){
                remove.push( name );
            }   
        }

        newItem.sort();
        remove.sort();
        return {
            "newItem": newItem,
            "removeItem": remove,
            "windowMap": windowProp
        };
    }
    
    function _log( newItem, removeItem ){
        if( newItem.length || removeItem.length){
            var delta = newItem.length-removeItem.length;
            console.info( 'Delta ', delta>0?'+'+delta:delta );
            if( newItem.length ){
                console.info( 'New Item', newItem.length );
                console.info( 'New Item', newItem );
            }
            if( removeItem.length ){
                console.info( 'Misisng', removeItem.length );
                console.info( 'Misisng', removeItem );
            }
        }
    }
    
    return {
        /**
         * Take a snapshot of the current state of the global, and compare it to the previous one
         */
        snapshot: function(){
            var states = _compareState( snapshot );
            console.log('Total Number ', states.windowMap.length );
            _log( states.newItem, states.removeItem );
            var newMap = {};
            for( var i=0; i<states.windowMap.length; i++ ){
                newMap[ states.windowMap[i] ] = true;
            }
            snapshot = newMap;
            return;
        },
        
        /**
         * Save the current state of the global namespace
         * 
         * @param {String} stateName Identifier needed to be used later by compareState
         */
        saveState: function( stateName ){
            savedStates[stateName] = {};
            for( var name in window ){
                savedStates[stateName][name] = true;
            }
        },
        
        /**
         * Compare the current state to a previous version saved with saveState
         * 
         * @param {String} stateName Identifier of the previous state
         */
        compareState: function( stateName ){
            var states = _compareState( savedStates[stateName] );
            _log(states.newItem, states.removeItem);
        }
    };
})();
