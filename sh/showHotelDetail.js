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
			"hotelid": { "type": "string", "required": true },
			"searchResult": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
        logger.info('Show Hotel Details '+text);
      	
		var name = text;
		var city = sdk.properties().city.toUpperCase();  
		var roomType =sdk.properties().room.toUpperCase();  
		var nroom =sdk.properties().nroom;  		
		// esto es un workaround pq hay un bug para extraer la propiedad de date.		
		var indice = sdk.properties().from.indexOf(",");
		var fromd = sdk.properties().from.substring(6, indice);
	//	console.log("fromdate:: "+fromd);		
		var nights =sdk.properties().nights;  
	//	console.log("nights:: "+nights);	
		var inicio = fromd;
				
		var canal="";					
		var savedSearch;
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
			savedSearch=  JSON.parse(sdk.properties().searchResult);
			//console.log("savedSearch: "+savedSearch);
			var sw=false;
			var i=0;
			while ((!sw)&&(i<savedSearch.length))
			{		
			//	console.log("comparison "+i+" --"+savedSearch[i].name+" "+name);
				if (savedSearch[i].name.toUpperCase()==name.toUpperCase())
				{
					name=savedSearch[i].id;
					console.log("saving name as "+name);
					sw=true;
				}
				i++;
			}
		}
		
		
		console.log("name: "+name+" city: "+city+" roomType: "+roomType+" nroom: "+nroom+" fromd: "+inicio+" nights: "+nights);
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var args = {			
			headers: { "Content-Type": "application/json" }
		};
		
	      console.log("url: http://new.soa.digitalpracticespain.com:8001/smarthospitality/offers/MADRID/"+city+"/"+name.toLowerCase());
		var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/offers/MADRID/"+city+"/"+name.toLowerCase(), args,function (data, response) {

	//	console.log("datos detalle del hotel: "+data);
		//console.log("datos detalle del hotel: "+JSON.stringify(data));
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
			sdk.reply({text: "Brand: "+brand+"\nHotel: "+hotelName});	
			//sdk.reply({text: "Hotel: "+hotelName});					
			sdk.reply({text: "Address: "+address+", City: "+city});		
			sdk.reply({img: photos[0]});											
			var m=0;	
			var arraybotones=[];
			for (var i=0;i<rates.length;i++)
			{
				
				if ((rates[i].type.toUpperCase()==roomType.toUpperCase()) || (roomType.toUpperCase()=='ALL KIND'))
				{
					sdk.reply({text: "Price of: "+rates[i].name+": "+rates[i].price+"€"});	
					sdk.reply({text: rates[i].description});
					sdk.reply({img: rates[i].images[0]});
					//var boton=jdata.id+" "+rates[i].id;		
					arraybotones[i]=rates[i].type;
					//var boton = rates[i].type;
					//sdk.reply({text: "Make reservation "+rates[i].name, choices: boton.split(',')});				
					m++;
				}
								  
			};
			
			if (m==0)
			{
				sdk.reply({text: "Ohh I'm sorry. There aren't avaible rooms of type "+roomType});	
			}else{
				arraybotones[rates.length]="Search Again";
				sdk.reply({text: "Make reservation on ", choices: arraybotones});				
			}
			 
			 
			var j = rates.length;			
		/*	var botones="Search Again";
			sdk.reply({text: "or...", choices: botones.split(',')}); */
			var resultadoRates=JSON.stringify(rates);	
			sdk.variable("ratesResult", resultadoRates); 
			sdk.variable("user.hotelid", name);
			sdk.variable("hotelid", name);			
			sdk.variable("user.fromDate", inicio);
			sdk.variable("user.nights",nights);
			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);					
		}else{		
					
			sdk.variable("user.hotelid", jdata.id);
			sdk.variable("hotelid", jdata.id);
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
				//console.log(rates[i].id+" "+jdata.id);
			}  
			
			if (m==0)
			{
				sdk.reply({text: "Ohh I'm sorry. There aren't avaible rooms of type "+roomType});	
			}
			
			
			var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
			sdk.reply(cardv2);
			
			var rates = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":ratescarrousel}}};
			sdk.reply(rates);
			
						
			var quickreply = {"text":"Show me the hotels again...","quick_replies":[{"content_type":"text","title":"Back","payload":"BACK_HOTELS"}]};
			sdk.reply(quickreply);
			
			
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);		
		}			
			
		});
	}
}
