"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "registerBooking",
        "properties": {
            "city": { "type": "string", "required": true },
			"name": { "type": "string", "required": true },
			"room": { "type": "string", "required": true },
			"nroom": { "type": "Integer", "required": true },
			"from": { "type": "date", "required": true },
			"nights": { "type": "Integer", "required": true },
			"hotelid": { "type": "string", "required": true },
			"ratesResult": { "type": "string", "required": true }
        },
        "supportedActions": [
            "askcustomerdata",
			"askpaymentmode",
            "fail"
        ]
    }),

	

    invoke: (sdk, done) => {
		
		
        const text = sdk.text();
        logger.info('registerBooking '+text);       
	    var name = sdk.properties().name.toUpperCase();  
		var city = sdk.properties().city.toUpperCase();  
		var roomType =sdk.properties().room.toUpperCase();  
		var nroom =sdk.properties().nroom;  
		var indice = sdk.properties().from.indexOf(",");
		let fromdate = sdk.properties().from.substring(6, indice);		
		var nfromdate = require('date-from-num');
		console.log(nfromdate(parseFloat(fromdate)));	
		var realfromdate=nfromdate(parseFloat(fromdate));
		console.log("nfromdate:: "+realfromdate);
		var nights =sdk.properties().nights; 
	
		function addDays(theDate, days) {
			return new Date(theDate.getTime() + days*24*60*60*1000);
		}
		var todate = addDays(realfromdate, nights);
		console.log("todate::: "+todate);


		
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
		console.log("social1: "+social1);
		var social2 = sdk.variable('profile.lastName');				
		console.log("social2: "+social2);
		var hotelid="";
		var rateid="";
		console.log("texto recibido: "+text);
		if (canal=='facebook')
		{
				var seleccion = text.split(' ');
				hotelid = seleccion[0];
				rateid = seleccion[1];		
		}else{
				hotelid = sdk.properties().hotelid;
				var ratesResult=JSON.parse(sdk.properties().ratesResult);
				console.log("ratesResult: "+sdk.properties().ratesResult);
				var sw=false;
				var i=0;
				while ((!sw)&&(i<ratesResult.length))
				{		
					console.log("comparison "+i+" --"+ratesResult[i].type+" "+text);
					if (ratesResult[i].type==text)
					{
						rateid=ratesResult[i].id;
						console.log("saving name as "+rateid);
						sw=true;
					}
					i++;
				}
		}
		
	
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var args = {
			data: {"DEMOZONE":city, "SOCIALID":social1+social2, "HOTELID" : hotelid, "OFFERID" : rateid, "checkin" : realfromdate, "checkout" : todate, "rooms" : nroom, "comments" : "not defined yet"},
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};
console.log("cuerpo mensaje:: "+JSON.stringify(args));				
		var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/BookingRequestService/smarthospitality/booking/request";
		var corrId = 0;
		var nextAction ="";
		client.post(urlPost, args, function (data, response) {
			console.log("datos en Register"+JSON.stringify(data));	
			corrId = data.corrId;
			nextAction = data.nextAction;
			console.log("registerBooking en hotel::"+ hotelid +" y rate:: "+rateid);	
			sdk.variable("corrId", corrId);
			sdk.variable("user.corrId", corrId);			
			
			if (nextAction=="ASK_CUSTOMER_DATA")
			{
				//el cliente no existe				
				console.log("request customer data, customer not exists");			
				sdk.action('askcustomerdata');        	
			}else if (nextAction=="ASK_PAYMENT_MODE"){
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
				
				var ccnumber =  data.payments.CC.number;				
				var ccexpiration = data.payments.CC.expiration;
				var ccccv = data.payments.CC.ccv;
				var paypalusername = data.payments.paypal.username;

				sdk.variable("creditcardnumber", ccnumber);				
				sdk.variable("creditcardexpiration", ccexpiration);				
				sdk.variable("creditcardccv", ccccv);				
				sdk.variable("paypalusername", paypalusername);				
						
						
				//sdk.reply({text: "mostrando datos del cliente:: a "+customerName+" b "+customerSurname+" c "+customerdocumentType+" d "+customerId+" e "+socialid+ " f "+ customerage+ " g "+customeraddress+ " h "+customercountry+" i "+customermobile+" j "+customeremail});				
				sdk.action('askpaymentmode');        	
			}else{
				//there was an error
				console.log("registerbook time nexaction: "+nextAction);
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
