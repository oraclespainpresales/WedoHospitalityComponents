"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

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
		
		
		
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;		
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var args = {				
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
		};
		var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/CheckOutRequestService/"+social;		
		//console.log("urlPost: "+urlPost);
		client.post(urlPost, function (data, response) {
		//	console.log("fin del post "+JSON.stringify(data));			
		sdk.reply({text: "Thank you! This is your receipt:"});					
								
		var elementos=[];		
		var amountToPay=66;
		if (data.booking.rooms==1)
		{			
			elementos[0] = {"title":data.booking.rooms.toString()+" "+data.booking.category+" room ", "subtitle":"#"+data.booking.roomid.toString(), "quantity":1,"price":amountToPay,"currency":"EUR","image_url":data.booking.roomimage}			
		}else{
			elementos[0] = {"title":data.booking.rooms.toString()+" "+data.booking.category+" rooms ", "subtitle":"subtitle", "quantity":1,"price":amountToPay,"currency":"EUR","image_url":data.booking.roomimage}			
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
		
		var receipt = {"attachment":{"type":"template","payload":{"template_type":"receipt","recipient_name":data.customer.name+" "+data.customer.surname,"order_number":data.booking.bookingid.toString(),"currency":"EUR","payment_method":"Visa 2345", "order_url":data.booking.hotelimage,"timestamp":timeseconds.toString(),"elements":elementos,"address":{"street_1":data.customer.address,"street_2":" ",  "city":"-", "postal_code":"-","state":data.customer.country,"country":data.customer.country},"summary":{"subtotal":withoutTaxes,"shipping_cost":0,"total_tax":taxes,"total_cost":amountToPay}}}}
		//, "adjustments":[{"name":"New Customer Discount","amount":1}, { "name":"$10 Off Coupon", "amount":1 }]
		console.log("recibo: "+JSON.stringify(receipt));
			sdk.reply(receipt);
			sdk.reply({text: "It's correct?"});			
			//sdk.reply({text: social1 +", did you enjoy your stay here?"});			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
		});
			
		
		/*sdk.reply({text: "Thank you! This is your receipt:"});					
		var receipt = {"attachment":{"type":"template","payload":{"template_type":"receipt","recipient_name":"Jesus Brasero","order_number":"12345678902","currency":"USD","payment_method":"Visa 2345", "order_url":"http://petersapparel.parseapp.com/order?order_id=123456","timestamp":"1428444852","elements":[{"title":"Laundry", "subtitle":"Wash and iron trousers", "quantity":2,"price":5,"currency":"USD","image_url":"http://ziyahlanjwalaundry.co.za/master/image_files/2015-08-13_ZIYAHLANJWA_LAUNDRY_SERVICES_2.jpg"},{"title":"Spa","subtitle":"Thai Massage","quantity":1, "price":90,"currency":"USD","image_url":"http://grohost2.com/~launchin/04_Client/3905/LocalPageSlide/s1.png"},{"title":"Hotel","subtitle":"Single room","quantity":1, "price":90,"currency":"USD","image_url":"http://amari.azureedge.net/phuket/hotel-photos/deluxe-room-1.jpg"}],"address":{"street_1":"1 Hacker Way","street_2":"",  "city":"Menlo Park", "postal_code":"94025","state":"CA","country":"US"},"summary":{"subtotal":185.00,"shipping_cost":0,"total_tax":18.0,"total_cost":167}, "adjustments":[{"name":"New Customer Discount","amount":10}, { "name":"$10 Off Coupon", "amount":10 }]}}}
		sdk.reply(receipt);
		sdk.reply({text: "It's correct?"});			
		//sdk.reply({text: social1 +", did you enjoy your stay here?"});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);*/
	}
			
//	}
}
