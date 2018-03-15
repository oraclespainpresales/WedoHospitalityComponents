"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "hospitality.openDoor",
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
	//	var customerId = sdk.properties().customerId;  				
        logger.info('openDoor');
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		
		
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;		
		var args = {			
			data: { "SOCIALID" : social },
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		//console.log("args:"+JSON.stringify(args));		
		var req=client.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/OpenDoorService/smarthospitality/welcome/opendoor", args,function (data, response) {	
			console.log("DATA:::" +JSON.stringify(data));	
			sdk.reply({text: data.message});		
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
			
		});
		
		req.on('requestTimeout', function (req) {
			console.log('request has expired');
			req.abort();
		});
		 
		req.on('responseTimeout', function (res) {
			console.log('response has expired');		 
		});		
		
		req.on('error', function (err) {
			console.log('request error', err);
		});				
		
		
	}
}
