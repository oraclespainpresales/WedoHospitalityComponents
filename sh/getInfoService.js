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
		
		logger.info('getInfoService........ '+service);
		if (service!='<not set>')
		{			
			if (service.indexOf(';')>0){
				var splitted =service.split(';');
				var selected= splitted[0];
				service = splitted[1];				
				logger.info('getInfoService1 '+service);
			}else{
				logger.info('getInfoService2 '+service);
			}			
		}else if (text!=null){
			logger.info('getInfoService3 '+text);	
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
			sdk.reply({text: "getting info service..."+service+" to get at "+when+". Charge in: "+payment});			
			var buttons="Yes,No";
			buttons = buttons.split(',');
			var finalBUttons = [];
			buttons.forEach(function (button) {
				finalBUttons.push({title: button, payload: button});
			});
			
			var uiBuilder = new UIBuilder(sdk.channelType());
			var payload = uiBuilder.buildButtons("Order now. Are you sure?", finalBUttons);
			sdk.reply(payload);
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
			sdk.reply({text: "getting info service..."+service+" to get at "+when+". Charge in: "+payment});			
		}
		
							
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
