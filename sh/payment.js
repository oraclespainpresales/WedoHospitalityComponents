"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "payment",
        "properties": {              
            "corrId": { "type": "Integer", "required": true },		
            "ccnumber": { "type": "string", "required": true },		
            "ccexpiration": { "type": "string", "required": true },		            
            "ccccv": { "type": "string", "required": true },
			"paypalusername" : { "type": "string", "required": true },
			"paymentmode" : { "type": "string", "required": true }
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
		
		client.post(urlPost, args, function (data, response) {
			console.log("datos "+JSON.stringify(data));				
			var bookingId = data.bookingId;
			var hotelName = data.hotelName;
			var hotelCity = data.hotelCity;
			var checkin = data.checkin;
			var checkout = data.checkout;
			var rooms = data.rooms;		
			//there was an error
			sdk.reply({text: "Booked sucessfully, reservation code: "+bookingId});
			sdk.action('success'); 
			sdk.done(true);	
			done(sdk);
		});
		
	/*sdk.action('success');        
	sdk.done(true);	
	done(sdk);*/
				
	}
}
