"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "hospitality.saveComments",
        "properties": {
			"comment": { "type": "string", "required": true },
			"corrId": { "type": "Integer", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
       // const text = sdk.text();
		//console.log("Text: "+text);
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
	
	//	sdk.reply({text: "saveComments"});						
		var Client = require('node-rest-client').Client;
		var client = new Client();
		/*var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');			
		var social = social1+social2;		*/		
		var corrId = sdk.variable('corrId');			
		var comments = sdk.properties().comment;
		var args = {			
			data: { "corrId" : corrId, "comments" : comments },
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		
		console.log("args:"+JSON.stringify(args));
		
		var req=client.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/PreCheckingProcessService/smarthospitality/prechecking/sendrequests", args,function (data, response) {
		
				sdk.variable("user.corrId", corrId);			
				console.log("DATA:::" +JSON.stringify(data));	
				var nextAction = data.nextAction;
				if (nextAction=="ASK FOR ROOM NUMBER")
				{
					sdk.reply({text: "We will do our best to satisfy your wishes. Your precheckin request is under review, we will get back to you as soon as possible. Thanks!"});			
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);
				}else{
					sdk.reply({text: "There was an error saving your comments. Please try again later..."});		
					sdk.action('fail');        
					sdk.done(true);	
					done(sdk);
				}
								
				
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
		
		req.on('error', function (err) {
			console.log('request error', err);
			sdk.action('fail');        
			sdk.done(true);	
			done(sdk);	
		});			
				
	}
			

}
