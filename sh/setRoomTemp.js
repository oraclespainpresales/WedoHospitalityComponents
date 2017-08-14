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
		
	//	sdk.reply({text: "setting room temperature to..."+roomTemp+" degrees"});			
		
		var args = {			
			headers: { "Content-Type": "application/json" }
		};
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;
		console.log("http://new.soa.digitalpracticespain.com:8001/admin/gadgets/netatmo/set/"+social+"/"+roomTemp);
		var req=client.post("http://new.soa.digitalpracticespain.com:8001/admin/gadgets/netatmo/set/"+social+"/"+roomTemp, args,function (data, response){		console.log("data: "+JSON.stringify(data));
			sdk.reply({text: data.message});		
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
		});

		req.on('requestTimeout', function (req) {
			console.log('request has expired');
			req.abort();
			sdk.action('fail');        
			sdk.done(true);	
			done(sdk);	
		});
		 
		req.on('responseTimeout', function (res) {
			console.log('response has expired');		 
			sdk.action('fail');        
			sdk.done(true);	
			done(sdk);	
		});
		
		//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
		req.on('error', function (err) {
			console.log('request error', err);
			sdk.action('fail');        
			sdk.done(true);	
			done(sdk);	
		});
		
		
		
	
	}
			
//	}
}
