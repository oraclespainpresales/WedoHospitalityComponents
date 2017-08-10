"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "updateSocialID",
        "properties": {	
			"tipo": { "type": "string", "required": true }		
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();		  
        logger.info('updateSocialID');
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";	
			var social1 = sdk.variable('profile.firstName');
			var social2 = sdk.variable('profile.lastName');		
			var social = social1+social2;		
			var Client = require('node-rest-client').Client;
			var client = new Client();		
			var args = {
				data: 	 { "SOCIALINTERNALID":sdk.payload().sender.id, "SOCIALID":social},
				headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};
			var urlPost="";		
			client.post(urlPost, args, function (data, response) {
				console.log("salida del post: "+JSON.stringify(data));
			});
			
			//sdk.reply({text: "closeDoor..."});			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		
	}
			
//	}
}
