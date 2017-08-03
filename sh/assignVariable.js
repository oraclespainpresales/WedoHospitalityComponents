"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "assignVariable",
        "properties": {
			"vari": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var variableEnviada = sdk.properties().vari;  		  
        logger.info('var');
    
		
		sdk.variable(variableEnviada, text);	
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
