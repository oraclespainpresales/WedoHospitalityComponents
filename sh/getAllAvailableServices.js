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
				
				var resultadoServices=JSON.stringify(data);	
				sdk.variable("resultadoServices", resultadoServices); 
			
					if (canal=='webhook')
					{		
							var arraybotones=[];
							for (var i=0;i<data.length;i++)
							{
								//var boton="Detail of "+data[i].name;		
								//sdk.reply({text: data[i].name+"\n"+"WeDoPoints: "+ data[i].wedopoints+" \nPrice:"+ data[i].price+"€ ", choices: boton.split(',')});		
								sdk.reply({text: data[i].name+"\n"+"WeDoPoints: "+ data[i].wedopoints+" \nPrice:"+ data[i].price+"€ "});		
								arraybotones[i]=data[i].name;
							}	
							//var botones="Not Order";
							//sdk.reply({text: "ouw!! i'm not sure, let me come back later!", choices: botones.split(',')}); 							
							arraybotones[data.length]="Not Order";
							sdk.reply({text: "Please choose an option", choices: arraybotones});		
							
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
							
							
							var quickreply = {"text":"ouw!! i'm not sure, let me come back later!","quick_replies":[{"content_type":"text","title":"Not Order","payload":"BACK_SEARCH"}]};
							sdk.reply(quickreply);
							sdk.action('success');        
							sdk.done(true);	
							done(sdk);						
					}

			});

				req.on('requestTimeout', function (req) {
				console.log('request has expired');
				req.abort();
				sdk.action('fail');        
				sdk.done(true);	
				done(sdk);	
			});
			 
			req.on('responseTimeout', function (res) {
				console.log('response has expired');		 
				sdk.action('fail');        
				sdk.done(true);	
				done(sdk);	
			});
			
			//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
			req.on('error', function (err) {
				console.log('request error', err);
				sdk.action('fail');        
				sdk.done(true);	
				done(sdk);	
			});
		
		}else{
			sdk.reply({text: "Ha seleccionado un servicio: "+selectedService});
			sdk.action('success');        
			sdk.done(true);	
			done(sdk);			
		}
	
		
	}
}
