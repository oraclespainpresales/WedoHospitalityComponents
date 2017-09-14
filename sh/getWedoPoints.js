"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "getWedoPoints",
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
        logger.info('getWedoPoints');
        
		
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
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		
		
		console.log("INVOCANDO:::" +"http://new.soa.digitalpracticespain.com:8001/blockchain/wedo/points/"+encodeURIComponent(social));		
		var req=client.get("http://new.soa.digitalpracticespain.com:8001/blockchain/wedo/points/"+encodeURIComponent(social), args,function (data, response) {		
			console.log("DATA:::" +JSON.stringify(data));
			if (data.balance==-1)
			{
				sdk.reply({text: "I'm sorry, your balance its not available due to you don't have a WeDo Points account."});			
				sdk.action('success');        
				sdk.done(true);	
				done(sdk);	
			}else{
				sdk.reply({text: "Your Balance is: "+data.balance+" WeDO Points"});							
				sdk.action('success');        
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
			
//	}
}
