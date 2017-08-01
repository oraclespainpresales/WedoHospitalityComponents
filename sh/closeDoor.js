"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "closeDoor",
        "properties": {
			"customerId": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var customerId = sdk.properties().customerId;  		  
        logger.info('closeDoor');
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		sdk.reply({text: "closing Door..."});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
