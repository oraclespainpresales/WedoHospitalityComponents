"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "MakeOrder",
        "properties": {
			"service": { "type": "string", "required": true},
			"serviceId": { "type": "string", "required": true},
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
        logger.info('MakeOrder');
        	var social1 = sdk.variable('profile.firstName');
			var social2 = sdk.variable('profile.lastName');		
			var social = social1+social2;
			var service = sdk.properties().service;
			var serviceId = sdk.properties().serviceId;
			var when = sdk.properties().when;
			var indice = sdk.properties().when.indexOf(",");
			var fechaServicio = sdk.properties().when.substring(6, indice);
		//	console.log("fechaServicio: "+fechaServicio);
			var date = new Date(parseInt(fechaServicio)).toISOString();			
			console.log("fechaServicio: "+date);
			var payment = sdk.properties().payment;
			
		
			var args = {
				data: {"SOCIALID": social, "SERVICEID": serviceId ,"payment": payment, "servicedatetime": date},
				headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};		
			var Client = require('node-rest-client').Client;
			var client = new Client();		
			console.log("args: "+JSON.stringify(args));
			var req=client.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/BookServiceService/smarthospitality/service/book", args,function (data, response) {	
				var canal="";					
				console.log("dentro de la llamada "+JSON.stringify(data));
				if (sdk.channelType() == "facebook") {
					console.log("es FACEBOOK");
					canal="facebook";			
				}
				else {
					console.log("es WEBHOOK");
					canal="webhook";
				}
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
			
			/*sdk.action('success');        
			sdk.done(true);	
			done(sdk);*/
	}
}
