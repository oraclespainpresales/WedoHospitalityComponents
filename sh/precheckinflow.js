"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "precheckinflow",
        "properties": {
			"tipo": { "type": "string", "required": true }
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
		
	
	//	sdk.reply({text: "precheckinflow"});						
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;		
		//var social = "JesusBrasero";		
		var args = {			
			data: { "SOCIALID" : social },
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		var corrid=0;
		//sdk.reply({text: "retreiving your booking...."});		
		console.log("args:"+JSON.stringify(args));
		
		var req=client.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/PreCheckingProcessService/smarthospitality/prechecking/initlializaton", args,function (data, response) {
		
				console.log("DATA:::" +JSON.stringify(data));	
				var nextAction = data.nextAction;
				if (nextAction=="NO BOOKINGS")
				{
					sdk.reply({text: "I'm sorry, you don't have a booking on our systems. Please make a booking first."});			
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);
				}else if (nextAction=="ASK FOR PRECHECKING"){					
					sdk.reply({text: "You have a reservation of a "+data.booking.roomType+" room on "+data.booking.name+" @"+data.booking.city+", "+data.booking.country+" "});		
					corrid=data.corrId;
					var client2 = new Client();
					var args2 = {			
						data: { "corrId": corrid },
						headers: { "Content-Type": "application/json", "Accept": "application/json"}
					};
					console.log("args2:"+JSON.stringify(args2));
					
					var req2=client2.post("http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/PreCheckingProcessService/smarthospitality/prechecking/getcustomerdata", args2,function (data2, response2) {		
						console.log("DATA:::" +JSON.stringify(data2));	
						corrid=data2.corrId;						
						sdk.reply({text: "Please confirm your data"});		
						sdk.reply({text: data2.customer.name+" "+data2.customer.surname+" and document "+data2.customer.documentType+": "+data2.customer.customerId+"."});		
						sdk.reply({text: data2.customer.address+" "+data2.customer.country+". "});		
						sdk.reply({text: data2.customer.email+" "+data2.customer.mobile+". "});
					//	sdk.reply({text: "It's correct?"});		
					
					
					if (canal=='facebook')
					{
						var buttons="Yes,No";
						buttons = buttons.split(',');
						var finalBUttons = [];
						buttons.forEach(function (button) {
							finalBUttons.push({title: button, payload: button});
						});
						
						var uiBuilder = new UIBuilder(sdk.channelType());
						var payload = uiBuilder.buildButtons("It's correct?", finalBUttons);
						sdk.reply(payload);
					}else{
						var botones="Yes,No";
						sdk.reply({text: "It's correct?", choices: botones.split(',')});
					}
						


						sdk.variable("corrId", corrid);						
						sdk.variable("user.corrId", corrid);						
						sdk.variable("documentnumber",data2.customer.customerId);
						sdk.variable("citySelect",data.booking.city);
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);
					});
				}else{
					sdk.reply({text: "There was an error and you have a big problem LOL"});		
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
