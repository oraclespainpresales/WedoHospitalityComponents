"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "setRoomTemp",
        "properties": {
			"customerId": { "type": "string", "required": true },
			"roomTemp": { "type": "Integer", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var customerId = sdk.properties().customerId.toUpperCase();  		
		var roomTemp =sdk.properties().roomTemp;  
        logger.info('setRoomTemp '+ roomTemp);
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		sdk.reply({text: "setting room temp to..."+roomTemp+" ºC"});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
