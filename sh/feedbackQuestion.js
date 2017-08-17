"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "feedbackQuestion",
        "properties": {
			"text": { "type": "string", "required": true},
			"var": { "type": "number", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();		  
        logger.info('feedbackQuestion');
		var question =  sdk.properties().text;
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";
			var buttons="5,4,3,2,1";
			buttons = buttons.split(',');
			var finalBUttons = [];
			buttons.forEach(function (button) {
				finalBUttons.push({title: button, payload: button});
			});
			
			var uiBuilder = new UIBuilder(sdk.channelType());
			var payload = uiBuilder.buildButtons(question, finalBUttons);
			sdk.reply(payload);			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";		
			//sdk.reply({text: "feedbackQuestion..."});			
			var botones="5,4,3,2,1";
			sdk.reply({text: question, choices: botones.split(',')});
		}
		
		
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
