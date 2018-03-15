"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "hospitality.payment",
        "properties": {              
            "corrId": { "type": "Integer", "required": true },		
            "ccnumber": { "type": "string", "required": true },		
            "ccexpiration": { "type": "string", "required": true },		            
            "ccccv": { "type": "string", "required": true },
			"paypalusername" : { "type": "string", "required": true },
			"paymentmode" : { "type": "string", "required": true },
			"legacy": { "type": "boolean", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
        logger.info('payment');
		
		console.log("ccnumber: "+ sdk.properties().ccnumber);
		console.log("ccexpiration: "+ sdk.properties().ccexpiration);
		console.log("ccccv: "+ sdk.properties().ccccv);
		
		var corrId = sdk.properties().corrId;
		corrId = corrId.startsWith('${') ? null : corrId;
		var ccnumber = sdk.properties().ccnumber;
		var ccexpiration = sdk.properties().ccexpiration;
		var ccccv = sdk.properties().ccccv;
		var paypalusername = sdk.properties().paypalusername;	
		var paymentmode = sdk.properties().paymentmode;	
		var legacy = sdk.properties().legacy;
		var nextAction ="";
		var canal="";		

		
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		
	
		sdk.reply({text: "making payment..."});	
	
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var args = {data:{"corrId":corrId,"payment":{"CC":{"number":ccnumber,"expiration":ccexpiration,"ccv":ccccv},"paypal":{"username":"username","password":"password"}}},headers:{"Content-Type":"application/json","Accept":"application/json"}};

		//console.log("cuerpo mensaje:: "+args);			
		console.log("cuerpo mensaje:: "+JSON.stringify(args));			
		var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/BookingRequestService/smarthospitality/booking/payment";
		
		var req=client.post(urlPost, args, function (data, response) {
			console.log("datos "+JSON.stringify(data));				
			var bookingId = data.bookingId;
			var hotelName = data.hotelName;
			var hotelCity = data.hotelCity;
			var checkin = data.checkin;
			var checkout = data.checkout;
			var rooms = data.rooms;		
			if (legacy){	
				sdk.reply({text: "Booked sucessfully, reservation code: "+bookingId});
			}else{
				var operaId = data.operaBookingId;
				sdk.reply({text: "Booked sucessfully, reservation code: "+bookingId+" and OPERA id: "+operaId});
			}
			
			sdk.action('success'); 
			sdk.done(true);	
			done(sdk);
		});
		
	/*sdk.action('success');        
	sdk.done(true);	
	done(sdk);*/
	
	
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
				
	}
}
