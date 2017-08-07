"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "getInfoService",
        "properties": {
			"service": { "type": "string", "required": true},
			"when": { "type": "date", "required": true},
			"payment": { "type": "string", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var service = sdk.properties().service;
		var when = sdk.properties().when;
		var payment = sdk.properties().payment;
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;
		logger.info('getInfoService........ '+service+" "+when+" "+payment);
		
		
		if (service!='<not set>')
		{			
			if (service.indexOf(';')>0){
				var splitted =service.split(';');
				var selected= splitted[0];
				service = splitted[1];				
		//		logger.info('getInfoService1 '+service);
			}else{
			//	logger.info('getInfoService2 '+service);
			}			
		}else if (text!=null){
		//	logger.info('getInfoService3 '+text);	
			var splitted =text.split(';');
			var selected= splitted[0];
			service = splitted[1];			
		}else{
			logger.info('should not be there...');
		}
		       
        var canal="";	
		
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";				
			
			var services = [];				
			var args = {			
				headers: { "Content-Type": "application/json" }
			};
			var Client = require('node-rest-client').Client;
			var client = new Client();		
			
			var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/services/"+encodeURIComponent(social), args,function (data, response) {			
				var nservices=data.length;							
				for (var i=0;i<data.length;i++)
				{
					if (data[i].name==service)
					{
						//console.log("es el bueno: "+data[i].name);
						services = data[i];
					//	console.log("service selected: "+JSON.stringify(services));
					}
				}
				var serviceId = services.id;
				sdk.variable("serviceId", serviceId);						
				sdk.reply({"attachment":{"type":"image","payload":{"url":services.images[0]}}});	
				sdk.reply({text: services.name });
				sdk.reply({text:  services.description.substr(0, 350)+"..."});
				sdk.reply({text: services.price+"€ or "+services.wedopoints+" WeDo Points"});
				//sdk.reply({text: "getting info service..."+service+" to get at "+when+". Charge in: "+payment});	
				sdk.reply({text: "Order details:\n"+service+"\nWhen: "+when+"\nCharge: "+payment});	
				var buttons="Yes,No";
				buttons = buttons.split(',');
				var finalBUttons = [];
				buttons.forEach(function (button) {
					finalBUttons.push({title: button, payload: button});
				});
				
				var uiBuilder = new UIBuilder(sdk.channelType());
				var payload = uiBuilder.buildButtons("Order now. Are you sure?", finalBUttons);
				sdk.reply(payload);				
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
			
			//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
			req.on('error', function (err) {
				console.log('request error', err);
			});
									
		
		}else {
			console.log("es WEBHOOK");
			canal="webhook";
			sdk.reply({text: "getting info service..."+service+" to get at "+when+". Charge in: "+payment});			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);
		}
		
	}
			
//	}
}
