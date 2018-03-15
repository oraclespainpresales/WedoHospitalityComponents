"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "hospitality.getWedoPoints",
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
        var city = "";//sdk.properties().tipo.toUpperCase();  
		
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
		var clientp = new Client();
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;		
		
		
		var argsp = {			
			data: { "SOCIALID" : social },
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		console.log("argsp:"+JSON.stringify(argsp));
		var reqp=clientp.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/PreCheckingProcessService/smarthospitality/prechecking/initlializaton", argsp,function (data, response) {
		
							console.log("DATA:::" +JSON.stringify(data));	
							var nextAction = data.nextAction;
							if (nextAction=="NO BOOKINGS")
							{
								sdk.reply({text: "I'm sorry, you don't have a booking on our systems. Please make a booking first."});
								sdk.done(true);	
								done(sdk);
							}else{					
								city=data.booking.city;	
								var args = {			
						headers: { "Content-Type": "application/json", "Accept": "application/json"}
					};
							
					//console.log("INVOCANDO:::" +"http://new.soa.digitalpracticespain.com:8001/blockchain/wedo/points/"+encodeURIComponent(social));		
					console.log("INVOCANDO:::" +"http://new.soa.digitalpracticespain.com:8001/blockchain/manage/points/query/bysocialid/"+city+"/"+encodeURIComponent(social));		
					var req=client.get("http://new.soa.digitalpracticespain.com:8001/blockchain/manage/points/query/bysocialid/"+city+"/"+encodeURIComponent(social), args,function (data, response) {		
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
				};
		});
				
		
				
	}
			
//	}
}
