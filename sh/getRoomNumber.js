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
		
			
	/*	var Client = require('node-rest-client').Client;
		var client = new Client();
		var social1 = sdk.variable('profile.firstName');
		//var social2 = sdk.variable('profile.lastName');		
		//var social = social1+social2;		
		var corrId = sdk.variable('corrId');			
		console.log("corrId: "+corrId);		
		
		sdk.variable("user.corrId", corrId);			
		var args = {			
			data: { "corrId" : corrId },
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		
		console.log("args:"+JSON.stringify(args));
		
		var req=client.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/PreCheckingProcessService/smarthospitality/prechecking/getroom", args,function (data, response) {
		
				console.log("DATA:::" +JSON.stringify(data));	
				if ((data.approvalResult=="APPROVED") || (data.roomNumber>0))
				{
					sdk.reply({text: social1+ ", it's your room number: "+data.roomNumber});
					if ((data.targetTemperature!=null) && (data.currentTemperature!=null))
						sdk.reply({text: "Your have done a special request about room temperature. Current: "+data.targetTemperature+"ºC Target: "+data.currentTemperature+"ºC"});			
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);					
				}else{
					sdk.reply({text: "Currently we can provide you a room number. Please, try again later."});			
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);	
				}
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
		});*/




		var Client = require('node-rest-client').Client;
		var client = new Client();
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;		
		//social= "CarlosCasares";		
		
		var args = {			
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		
		//console.log("args:"+JSON.stringify(args));
		
		var req=client.get("http://new.proxy.digitalpracticespain.com:9997/ords/pdb1/smarthospitality/stay/search/"+social, args,function (data, response) {
		
			//	console.log("DATA:::" +JSON.stringify(data));					
				//console.log("DATA:::" +response.statusCode);	
				if ((response.statusCode==200))
				{
					sdk.reply({text: social1+ ", it's your room number: "+data.roomid});
					/*if ((data.targetTemperature!=null) && (data.currentTemperature!=null))
						sdk.reply({text: "Your have done a special request about room temperature. Current: "+data.targetTemperature+"ºC Target: "+data.currentTemperature+"ºC"});			*/
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);					
				}else{
					sdk.reply({text: "Currently we can provide you a room number. Please, try again later."});			
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);	
				}
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
