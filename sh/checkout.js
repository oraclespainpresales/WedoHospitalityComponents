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
		sdk.reply({text: "Thank you! This is your receipt:"});					
		var receipt = {"attachment":{"type":"template","payload":{"template_type":"receipt","recipient_name":"Jesus Brasero","order_number":"12345678902","currency":"USD","payment_method":"Visa 2345", "order_url":"http://petersapparel.parseapp.com/order?order_id=123456","timestamp":"1428444852","elements":[{"title":"Laundry", "subtitle":"Wash and iron trousers", "quantity":2,"price":5,"currency":"USD","image_url":"http://ziyahlanjwalaundry.co.za/master/image_files/2015-08-13_ZIYAHLANJWA_LAUNDRY_SERVICES_2.jpg"},{"title":"Spa","subtitle":"Thai Massage","quantity":1, "price":90,"currency":"USD","image_url":"http://grohost2.com/~launchin/04_Client/3905/LocalPageSlide/s1.png"},{"title":"Hotel","subtitle":"Single room","quantity":1, "price":90,"currency":"USD","image_url":"http://amari.azureedge.net/phuket/hotel-photos/deluxe-room-1.jpg"}],"address":{"street_1":"1 Hacker Way","street_2":"",  "city":"Menlo Park", "postal_code":"94025","state":"CA","country":"US"},"summary":{"subtotal":185.00,"shipping_cost":0,"total_tax":18.0,"total_cost":167}, "adjustments":[{"name":"New Customer Discount","amount":10}, { "name":"$10 Off Coupon", "amount":10 }]}}}
		sdk.reply(receipt);	
		sdk.reply({text: "It's correct?"});			
		//sdk.reply({text: social1 +", did you enjoy your stay here?"});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
