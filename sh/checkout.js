"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "checkout",
        "properties": {
			"customerId": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var customerId = sdk.properties().customerId;  				
        logger.info('checkout');
        var social1 = sdk.variable('profile.firstName');
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		
		if (canal=="facebook")
		{
			var social1 = sdk.variable('profile.firstName');
			var social2 = sdk.variable('profile.lastName');		
			var social = social1+social2;		
			var Client = require('node-rest-client').Client;
			var client = new Client();		
			var args = {				
				headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};
			var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/CheckOutRequestService/"+social;		
			client.post(urlPost, function (data, response) {
				//	console.log("fin del post "+JSON.stringify(data));			
				sdk.reply({text: "This is your receipt:"});					
										
				var elementos=[];		
				var amountToPay=data.booking.costPerNight;
				var nights = data.booking.nights;
				
				if (data.booking.rooms==1)
				{			
					elementos[0] = {"title":data.hotel.name+" "+data.booking.rooms.toString()+" "+data.booking.category+" room ", "subtitle":nights+" night/s"+" Room: "+data.booking.roomid.toString(), "quantity":nights, "price":amountToPay,"currency":"EUR","image_url":data.booking.roomimage}			
					amountToPay=amountToPay*nights;
				}else{
					elementos[0] = {"title":data.hotel.name+" "+data.booking.rooms.toString()+" "+data.booking.category+" rooms ", "subtitle":nights+" night/s"+" Room: "+data.booking.roomid.toString(), "quantity":nights, "price":amountToPay,"currency":"EUR","image_url":data.booking.roomimag}			
					amountToPay=amountToPay*nights*data.booking.rooms;
				}
				
				for (var i=0; i<data.charges.length; i++)
				{
					var moneda="";		
					var pay="";			
					if (data.charges[i].payment=="WeDo Points")
					{
						moneda = "IDR";				
						pay="redemption";
					}else{
						moneda = "EUR";				
						pay="charge on";
						amountToPay=amountToPay+data.charges[i].amount;
					}			
					elementos[i+1] = {"title":data.charges[i].type+" - "+data.charges[i].name, "subtitle":pay+" "+data.charges[i].payment, "quantity":1,"price":data.charges[i].amount,"currency":moneda,"image_url":data.charges[i].thumbnail}
				}
				
				var timeseconds = Math.round(+new Date()/1000);	
				var	taxes = Math.round((amountToPay * 0.21));
				var withoutTaxes=Math.round(amountToPay -taxes);
				
				var receipt = {"attachment":{"type":"template","payload":{"template_type":"receipt","recipient_name":data.customer.name+" "+data.customer.surname,"order_number":data.booking.bookingid.toString(),"currency":"EUR","payment_method":"Visa 2345", "order_url":data.hotel.hotelimage,"timestamp":timeseconds.toString(),"elements":elementos,"address":{"street_1":data.customer.address,"street_2":" ",  "city":"-", "postal_code":"-","state":data.customer.country,"country":data.customer.country},"summary":{"subtotal":withoutTaxes,"shipping_cost":0,"total_tax":taxes,"total_cost":amountToPay}}}}
				//, "adjustments":[{"name":"New Customer Discount","amount":1}, { "name":"$10 Off Coupon", "amount":1 }]
				//console.log("recibo: "+JSON.stringify(receipt));
				sdk.reply(receipt);
				//sdk.reply({text: "It's correct?"});			
				//sdk.reply({text: social1 +", did you enjoy your stay here?"});			
				var buttons="Yes,No";
				buttons = buttons.split(',');
				var finalBUttons = [];
				buttons.forEach(function (button) {
					finalBUttons.push({title: button, payload: button});
				});
				
				var uiBuilder = new UIBuilder(sdk.channelType());
				var payload = uiBuilder.buildButtons("It's correct?", finalBUttons);
				sdk.reply(payload);				
							
				sdk.action('success');        
				sdk.done(true);	
				done(sdk);			
			});
				
		}else{
			sdk.reply({text: "We will send you an email with your invoice. Thanks!"});						
			var botones="Yes,No";
			sdk.reply({text: "It's correct?", choices: botones.split(',')});
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);
		}
			
	}		
}
