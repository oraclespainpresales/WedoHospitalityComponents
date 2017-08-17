"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "saveFeedback",
        "properties": {
			"text": { "type": "string", "required": true},
			"var1": { "type": "Integer", "required": true},
			"var2": { "type": "Integer", "required": true},
			"var3": { "type": "Integer", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var var1 = sdk.properties().var1;  				
		var var2 = sdk.properties().var2;  				
		var var3 = sdk.properties().var3;  				
        logger.info("saveFeedback: "+var1+" "+var2+" "+var3);
        var respuestas=0;
		if (var1>=-1) respuestas=1;
		if (var2>=-1) respuestas=2;
		if (var3>=-1) respuestas=3;		
		
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		sdk.reply({text: "Thank you!! We wish to see you soon again."});			
		sdk.reply({text: "Saving data "+respuestas+" answers..."});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
