"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "conditionFromLastMessage",
        "properties": {
			"condition": { "type": "string", "required": true }
        },
        "supportedActions": [
            "equal",
            "notequal"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var condition = sdk.properties().condition;  		  
        logger.info('conditionFromLastMessage');
        
				
		
		if (text==condition)
		{
			sdk.action('equal');
			logger.info('equal');
			sdk.done(true);	
			done(sdk);
		}else{
			sdk.action('notequal');
			logger.info('equal');
			sdk.done(true);	
			done(sdk);
		}
					
	}
			
//	}
}
