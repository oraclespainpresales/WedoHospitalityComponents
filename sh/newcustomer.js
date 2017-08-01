"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "newcustomer",
        "properties": {  
            "name": { "type": "string", "required": true },		
            "surname": { "type": "string", "required": true },		
            "doctype": { "type": "string", "required": true },		
            "docnumber": { "type": "string", "required": true },		
            "age": { "type": "Integer", "required": true },		
            "address": { "type": "string", "required": true },		
            "hotelid": { "type": "string", "required": true },		
            "nationality": { "type": "string", "required": true },		
            "ccnumber": { "type": "string", "required": true },		
            "ccexpiration": { "type": "string", "required": true },		
            "ccccv": { "type": "string", "required": true },
			"customermobile" : { "type": "string", "required": true },
			"customeremail" : { "type": "string", "required": true }
        },
        "supportedActions": [
            "askpaymentmode",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
        logger.info('newcustomer');
		var name = sdk.properties().name;
		var surname = sdk.properties().surname;
		var type = sdk.properties().doctype;
		var docnumber = sdk.properties().docnumber;
		var age = sdk.properties().age;
		var address = sdk.properties().address;
		var hotelid = sdk.properties().hotelid;
		var nationality = sdk.properties().nationality;
		var ccnumber = sdk.properties().ccnumber;
		var ccexpiration = sdk.properties().ccexpiration;
		var ccccv = sdk.properties().ccccv;
		var customermobile = sdk.properties().customermobile;
		var customeremail = sdk.properties().customeremail;
		
		console.log("email y movil ::"+customeremail+" "+customermobile);
		
		var corrId = sdk.variable("corrId");
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
		
		
	/*	if (canal=='webhook')
		{					
					sdk.reply({text: "Personas de Contacto"});	
							
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);			
			
		}else{				
					sdk.reply({text: "Cambio: "});							
					
					
					sdk.action('success');        
					sdk.done(true);	
					done(sdk);			
				
		}	*/
		
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');
		
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var args = {
			data: {"corrId":corrId,"customer":{"documentType":type,"customerId":docnumber,"SOCIALID":social1+social2,"name":name,"surname":surname,"age":age,"address":address,"country":nationality, "mobile":customermobile, "email":customeremail},"payments":{"CC":{"number":ccnumber,"expiration":ccexpiration,"ccv":ccccv},"paypal":{"username":"username"}}},
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};
//console.log("cuerpo mensaje:: "+args);			
console.log("cuerpo mensaje:: "+JSON.stringify(args));			
		var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/BookingRequestService/smarthospitality/booking/customer";
		
		client.post(urlPost, args, function (data, response) {
			console.log("datos "+JSON.stringify(data));				
			corrId = data.corrId;
			nextAction = data.nextAction;
			console.log("new customer "+corrId+" "+nextAction);				
		   if (nextAction=="ASK_PAYMENT_MODE"){
				//el cliente existe
				var customerName= data.customer.name;
				var customerSurname= data.customer.surname;
				var customerdocumentType= data.customer.documentType;
				var customerId= data.customer.customerId;
				var socialid= data.customer.SOCIALID;
				var customerage= data.customer.age;
				var customeraddress= data.customer.address;
				var customercountry= data.customer.country;
				var customermobile= data.customer.mobile;
				var customeremail= data.customer.email;
		
//				sdk.reply({text: "mostrando datos del cliente:: a "+customerName+" b "+customerSurname+" c "+customerdocumentType+" d "+customerId+" e "+socialid+ " f "+ customerage+ " g "+customeraddress+ " h "+customercountry+" i "+customermobile+" j "+customeremail});				
				sdk.action('askpaymentmode');        	
			}else{
				//there was an error
				console.log("newcustomers time nexaction: "+nextAction);
				sdk.reply({text: "there was an error retreiving customer data"});
				sdk.action('fail');        					
			}
			sdk.done(true);	
			done(sdk);
			
				
			/*sdk.action('success');        
			sdk.done(true);	
			done(sdk);*/		
		});
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}
}
