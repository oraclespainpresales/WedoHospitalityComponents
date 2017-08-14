"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "getRoomNumber",
        "properties": {
			"corrId": { "type": "Integer", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		
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
		///console.log("id?? "+JSON.stringify(sdk.payload()));
		//console.log("sender "+sdk.payload().sender.id);
		//console.log("receptor "+sdk.payload().recipient.id);
		var social = social1+social2;		
		
		var args = {			
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		
		
		console.log("INVOCANDO:::" +"http://new.soa.digitalpracticespain.com/room/"+encodeURIComponent(social));
		
		var req=client.get("http://new.soa.digitalpracticespain.com/room/"+encodeURIComponent(social), args,function (data, response) {
		
				console.log("DATA:::" +JSON.stringify(data));					
				console.log("DATA:::" +response.statusCode);	
				if ((response.statusCode==200))
				{
					if (data.hasOwnProperty('roomid'))
					{
						sdk.reply({text: social1+ ", This is your room number: "+data.roomid});
						if ((data.temperature!=null))
							{
								sdk.reply({text: "Your have done a special request about room temperature. Current: "+data.temperature.current+"ºC Target: "+data.temperature.target+"ºC"});			
							}
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);										
					
					}else{
						sdk.reply({text: "Currently we can't provide you a room number. Please, try again later."});			
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);	
					}					
				}else{
					sdk.reply({text: "Currently we can't provide you a room number. Please, try again later."});			
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
			

}
