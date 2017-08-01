"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "requestPhoto",
        "properties": {
			"tipo": { "type": "string", "required": true },
			"corrId": {"type": "Integer", "required": true},
			"customerId": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var tipo = sdk.properties().tipo.toUpperCase();  		
		var corrId =sdk.properties().corrId;  
        logger.info('requestPhoto');
        
		
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
		//var social = "JesusBrasero";	
		var customerId = sdk.variable('documentnumber');
		var demoZone = sdk.variable('citySelect');
		
		var webui = {"attachment":{"type":"template","payload":{"template_type":"button","text":"Please, upload mandatory images","buttons": [{"type":"web_url","url":"https://e7e125e6.ngrok.io/upload?user="+customerId+"&corrId="+corrId+"&demozone="+demoZone,"title":"Upload ","webview_height_ratio":"tall", "webview_share_button":"hide"}]}}};
		sdk.reply(webui);	
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
