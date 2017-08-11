"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
//var FBMessenger = require('fb-messenger');
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "search",
        "properties": {  
            "city": { "type": "string", "required": true },		
            "room": { "type": "string", "required": true }		
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var city = sdk.properties().city.toUpperCase();  
		var roomType = sdk.properties().room.toUpperCase();  
	    logger.info('searching in '+city+" "+roomType);
       	   
	/*	console.log("sender "+sdk.payload().sender.id);
		console.log("receptor "+sdk.payload().recipient.id);	   
	   	var messenger = new FBMessenger('EAAFCo0ZB9MN4BAF3DPAT76WwsTeORmYBZCb7cCvVKlDZBqHOVTNHx7ObdYByMQDY5bTnShmjyceZAcqSSSZCtwjgZBeIoVHwOTWuXrFyB48zNWRwndjZAlrTJJVNydqkK7WRHZB5ky0ZBOnlptyXo1ZAIAbBnbUEBuOp57Q5IFZCzDoDwZDZD', 'REGULAR'); 
		messenger.sendTextMessage(sdk.payload().sender.id, 'Hello to customer', 'REGULAR', function (err, body)
	//	messenger.sendTextMessage(sdk.payload().recipient.id, 'Hello to receptor', 'REGULAR', function (err, body)
		{
		if (err) return console.error(err)				
			console.log("body: "+JSON.stringify(body));	
		});
	   	   */
		   
		   
	   
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		var hotelsExists=false;
		var hotels = [];
		var Client = require('node-rest-client').Client;
		var client = new Client();
		
		var args = {			
			headers: { "Content-Type": "application/json" }
		};
		
		var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/hotels/MADRID/"+city, args,function (data, response) {
			var jdata=data;
			var nhotels=0;			
			if (jdata.length>0)
			{
				hotelsExists=true;
				nhotels=jdata.length;
				
			}else{
				hotelsExists=false;
			}
		
			if (hotelsExists)
			{
				sdk.reply({text: "Searching a "+roomType+" room in "+city+"..."});	
				var i=0;
				var j=0;				
				
			}else{
				sdk.reply({text: "There are no hotels availables in "+city+" "+roomType});						
				sdk.action('fail');        
				sdk.done(true);	
				done(sdk)
			}

				
				var resultadoBusqueda=JSON.stringify(jdata);	
				sdk.variable("searchResult", resultadoBusqueda);			
		
				if (canal=='webhook')
				{		var botones=[];
						for (var i=0;i<jdata.length;i++)
						{						
							botones[i]=jdata[i].name;
							sdk.reply({text: "Hotel: "+jdata[i].name+"\nLocation: "+ jdata[i].address+" \nPrice from:"+ jdata[i].from.price+"€ "});
							sdk.reply({img: jdata[i].images[0]});
							//sdk.reply({text: jdata[i].description});
						}
						var j = jdata.length;
						botones[j]="Search Again";
						sdk.reply({text: "Choose an option", choices: botones});
						
						/*var boton="Or search Again";				
						sdk.reply({text: "I'm not sure...", choices: boton.split(',')});*/
						
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);			

				}else{	
						var carrousel = [];						
						for (var i=0;i<jdata.length;i++)
						{
							carrousel[i]={
								"title":jdata[i].name,
								"subtitle":jdata[i].address+" Price from: "+ jdata[i].from.price+"€ ",
								"image_url": jdata[i].images[0],
								"buttons":[
								  {
									"type":"postback",
									"title":"Detail "+jdata[i].name,
									"payload":jdata[i].id
								  }
								]
							  };
						}  
					
						var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
						sdk.reply(cardv2);
						
						
						/*var quickreply = {"text":"I'm not sure...","quick_replies":[{"content_type":"text","title":"Search Again","payload":"BACK_SEARCH"}]};
						sdk.reply(quickreply);*/
						
						var buttons="Search Again";
						buttons = buttons.split(',');
						var finalBUttons = [];
						buttons.forEach(function (button) {
							finalBUttons.push({title: button, payload: 'BACK_SEARCH'});
						});
						var uiBuilder = new UIBuilder(sdk.channelType());
						var payload = uiBuilder.buildButtons("I'm not sure...", finalBUttons);
						sdk.reply(payload);
						
						
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);			
					
				}	
		});

		req.on('requestTimeout', function (req) {
			console.log('request has expired');
			req.abort();
		});
		 
		req.on('responseTimeout', function (res) {
			console.log('response has expired');		 
		});
		
		//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
		req.on('error', function (err) {
			console.log('request error', err);
		});
	}
}
