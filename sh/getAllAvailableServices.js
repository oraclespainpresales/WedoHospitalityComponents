"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();


module.exports = {

    metadata: () => ({
        "name": "getAllAvailableServices",
        "properties": {  
            "selectedService": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
			"fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var selectedService = sdk.properties().selectedService;  
		
	    logger.info('selectedService '+selectedService);
       	   
	     	
	   	   
	   
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		var isSelected = false;		
		
		if (selectedService=='<not set>')
		{			
			isSelected = false;
		}else{			
			isSelected = true;
		}
		
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;
	//	social = "JesusBrasero";
		console.log("social: "+social);
		
		if (!isSelected)
		{			
			var services = [];				
			var args = {			
				headers: { "Content-Type": "application/json" }
			};
			
			var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/services/"+encodeURIComponent(social), args,function (data, response) {			
				var nservices=data.length;			
				console.log("how many: "+nservices);
				
					if (canal=='webhook')
					{		
							for (var i=0;i<data.length;i++)
							{
								var boton="show info. of "+data[i].id;		
								sdk.reply({text: data[i].name+"\n"+"WeDoPoints: "+ data[i].wedopoints+" \nPrice:"+ data[i].price+"€ ", choices: boton.split(',')});		
							}										
							sdk.action('success');        
							sdk.done(true);	
							done(sdk);
					}else{
							var carrousel = [];						
							for (var i=0;i<data.length;i++)
							{
								carrousel[i]={
									"title":data[i].name+". Price: "+ data[i].price+"€ or "+ data[i].wedopoints+" WeDo Points",
									"subtitle":data[i].description,
									"image_url": data[i].images[0],
									"buttons":[
									  {
										"type":"postback",
										"title":"Detail "+data[i].name,
										"payload":data[i].id+";"+data[i].name
									  }
									]
								  };
							}  
						
							var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
							sdk.reply(cardv2);
							
							
							var quickreply = {"text":"Really, I don't want to order...","quick_replies":[{"content_type":"text","title":"Not Order","payload":"BACK_SEARCH"}]};
							sdk.reply(quickreply);
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
		
		}else{
			sdk.reply({text: "Ha seleccionado un servicio: "+selectedService});
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
		}
	
		
	}
}
