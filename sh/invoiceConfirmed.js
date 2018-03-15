"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "hospitality.invoiceConfirmed",
        "properties": {
			"tipo": { "type": "string", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();		  
        logger.info('invoiceConfirmed');
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
			var buttons="Yes,No";
			buttons = buttons.split(',');
			var finalBUttons = [];
			buttons.forEach(function (button) {
				finalBUttons.push({title: button, payload: button});
			});
			
			var uiBuilder = new UIBuilder(sdk.channelType());
			var payload = uiBuilder.buildButtons("Would you mind giving us some feedback so that we can do better for you??", finalBUttons);
			sdk.reply(payload);
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
			var botones="Yes,No";
			sdk.reply({text: "Would you mind giving us some feedback so that we can do better for you??", choices: botones.split(',')});
		}
		
	//	sdk.reply({text: "invoiceConfirmed..."});			
	//	sdk.reply({text: "Did you enjoy your stay here? Please, provide a feedback."});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
