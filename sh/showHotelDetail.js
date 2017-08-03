"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
//var moment = require('moment');

module.exports = {

    metadata: () => ({
        "name": "showHotelDetail",
        "properties": {  
            "city": { "type": "string", "required": true },
			"name": { "type": "string", "required": true },
			"room": { "type": "string", "required": true },
			"nroom": { "type": "Integer", "required": true },
			"from": { "type": "date", "required": true },
			"nights": { "type": "Integer", "required": true },
			"hotelid": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
        logger.info('Show Hotel Details '+text);
      	
		var name = text;//sdk.properties().name.toUpperCase();  
		var city = sdk.properties().city.toUpperCase();  
		var roomType =sdk.properties().room.toUpperCase();  
		var nroom =sdk.properties().nroom;  
		//var fromd =sdk.properties().from;  		
		// esto es un workaround pq no soy capaz de extraer la propiedad de date.		
		var indice = sdk.properties().from.indexOf(",");
		var fromd = sdk.properties().from.substring(6, indice);
		console.log("fromdate:: "+fromd);
	
		
		
		var nights =sdk.properties().nights;  
		console.log("nights:: "+nights);
	
	//	var inicio = fromd.split("from");
		var inicio = fromd;
		//console.log("name: "+name+" city: "+city+" roomType: "+roomType+" nroom: "+nroom+" fromd: "+inicio[1]+" nights: "+nights);
		console.log("name: "+name+" city: "+city+" roomType: "+roomType+" nroom: "+nroom+" fromd: "+inicio+" nights: "+nights);
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		
		//sdk.reply({text: "showing hotel "+name+" details in "+city+"....."});		
		
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var args = {			
			headers: { "Content-Type": "application/json" }
		};
		
		console.log("url: http://new.soa.digitalpracticespain.com:8001/smarthospitality/offers/MADRID/"+city+"/"+name.toLowerCase());
		var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/offers/MADRID/"+city+"/"+name.toLowerCase(), args,function (data, response) {
		//var req=client.get("https://a6b48d64.ngrok.io/ibcs/data/"+name+".js", args, function (data, response) {
		//	console.log("DATA:::" +JSON.stringify(data));
			//console.log("DATA:::" +data);
			//var jdata=JSON.parse(data);
			var jdata=data;
			var hotelName="";
			var brand="";
			var address="";
			var address="";
			var desc="";
			var price=0;
			var stars=0;
			var photos=[];
			var rates=[];			
			
			hotelName=jdata.name;
			brand=jdata.brand;
			address=jdata.address;
			desc=jdata.description;
			stars=jdata.stars;
			photos=jdata.images;	
			rates=jdata.rates;
		
		
		if (canal=='webhook')
		{		
			sdk.reply({text: "Brand: "+brand});	
			sdk.reply({text: "Hotel: "+hotelName});					
			sdk.reply({text: "Address: "+address+", City: "+city});		
			var m=0;	
			
			for (var i=0;i<rates.length;i++)
			{
				
				if ((rates[i].type.toUpperCase()==roomType.toUpperCase()) || (roomType.toUpperCase()=='ALL KIND'))
				{
					sdk.reply({text: +rates[i].name+", "+rates[i].price+"€"});	
					sdk.reply({text: rates[i].description});				
					var boton=jdata.id+" "+rates[i].id;		
					sdk.reply({text: "Make reservation "+rates[i].id, choices: boton.split(',')});				
					m++;
				}
								  
			};
			
			if (m==0)
			{
				sdk.reply({text: "Ohh I'm sorry. There aren't avaible rooms of type "+roomType});	
			}
			 
			sdk.variable("user.hotelid", jdata.id);
			sdk.variable("hotelid", jdata.id);
			//sdk.variable("user.fromDate", inicio[1]);
			sdk.variable("user.fromDate", inicio);
			sdk.variable("user.nights",nights);
			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);					
		}else{		
					
			sdk.variable("user.hotelid", jdata.id);
			sdk.variable("hotelid", jdata.id);
			//sdk.variable("user.fromDate", inicio[1]);
			sdk.variable("user.fromDate", inicio);
			sdk.variable("user.nights", nights);
			sdk.reply({text: "Brand: "+brand});	
			sdk.reply({text: "Hotel: "+hotelName});					
			sdk.reply({text: "Address: "+address+", City: "+city});		
			
			var carrousel = [];
			for (var i=0;i<photos.length;i++)
			{
				carrousel[i]={
					"title":"Photo "+i,
					"subtitle":"",
					"image_url": photos[i]
				  };
			} 
			
			
			var ratescarrousel = [];	
			var m=0;			
			for (var i=0;i<rates.length;i++)
			{
				
				if ((rates[i].type.toUpperCase()==roomType.toUpperCase()) || (roomType.toUpperCase()=='ALL KIND'))
				{
				
					ratescarrousel[m]={
						"title":rates[i].name+", "+rates[i].price+"€",
						"subtitle":rates[i].description,
						"image_url": rates[i].images[0],
						"buttons":[
									  {
										"type":"postback",
										"title":"Book Room",
										"payload":jdata.id+" "+rates[i].id
									  }
									]
					};
					m++;
				}
				console.log(rates[i].id+" "+jdata.id);
			}  
			
			if (m==0)
			{
				sdk.reply({text: "Ohh I'm sorry. There aren't avaible rooms of type "+roomType});	
			}
			
			
			var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
			sdk.reply(cardv2);
			
			var rates = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":ratescarrousel}}};
			sdk.reply(rates);
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);		
		}			
			
		});
	}
}
