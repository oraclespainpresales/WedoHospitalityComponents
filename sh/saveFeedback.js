"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "saveFeedback",
        "properties": {
			"text": { "type": "string", "required": true},
			"ask1": { "type": "string", "required": true},
			"ask2": { "type": "string", "required": true},
			"ask3": { "type": "string", "required": true},
			"var1": { "type": "Integer", "required": true},
			"var2": { "type": "Integer", "required": true},
			"var3": { "type": "Integer", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var prompting = sdk.properties().text;  				
		var var1 = parseInt(sdk.properties().var1);  				
		var var2 = parseInt(sdk.properties().var2);  				
		var var3 = parseInt(sdk.properties().var3); 
		var ask1 = sdk.properties().ask1;  				
		var ask2 = sdk.properties().ask2;  				
		var ask3 = sdk.properties().ask3; 
		var social1 = sdk.variable('profile.firstName');
		var social2 = sdk.variable('profile.lastName');		
		var social = social1+social2;
		
        logger.info("saveFeedback: "+ask1+" "+ask2+" "+ask3);
        logger.info("saveFeedback: "+var1+" "+var2+" "+var3);
        var respuestas=0;
		if (var1>=-1) respuestas=1;
		if (var2>=-1) respuestas=2;
		if (var3>=-1) respuestas=3;		
		
		var preguntasArray=[];
		var respuestasArray=[];
		if (respuestas==1)
		{
			preguntasArray[0]=ask1;
			respuestasArray[0]=var1;
		}else if (respuestas==2){
			preguntasArray[0]=ask1;
			respuestasArray[0]=var1;
			preguntasArray[1]=ask2;
			respuestasArray[1]=var2;
		}else if (respuestas==3){
			preguntasArray[0]=ask1;
			respuestasArray[0]=var1;
			preguntasArray[1]=ask2;
			respuestasArray[1]=var2;
			preguntasArray[2]=ask3;
			respuestasArray[2]=var3;
		}
		
				
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
		sdk.reply({text: prompting});			

		var survey = [];
		for (var i=0;i<respuestas;i++)
		{
					survey[i]={
						"question": preguntasArray[i],
						"answer": respuestasArray[i]
					  };
		} 
			
		
		var Client = require('node-rest-client').Client;
		var client = new Client();		
		var args = {
			data: { "SOCIALID":social, "survey" : survey},
			headers: { "Content-Type": "application/json", "Accept": "application/json"}
			};
		console.log("cuerpo mensaje:: "+JSON.stringify(args));				
		var urlPost="http://new.soa.digitalpracticespain.com:8001/soa-infra/resources/default/BOT_Helper!1.0/CheckOutCompleteService/complete";
		var req=client.post(urlPost, args, function (data, response) {
			sdk.reply({text: "Saving data "+respuestas+" answers..."});	
		});//invoke
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
		
		req.on('error', function (err) {
			console.log('request error', err);
			sdk.action('fail');        
			sdk.done(true);	
			done(sdk);	
		});
		
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
