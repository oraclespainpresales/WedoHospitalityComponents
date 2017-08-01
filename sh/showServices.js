"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "showServices",
        "properties": {			
			"options": { "type": "enum", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();
		var options = sdk.properties().options;  				
		console.log("options: "+options);		
        logger.info('showServices');
        
		
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
		}
		
				
	//	var services = {"attachment":{"type":"template","payload":{"template_type":"list","elements":[{"title":"Classic T-Shirt Collection","image_url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","subtitle":"See all our colors","default_action":{"type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"},"buttons":[{"title":"View","type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"}]},{"title":"Classic White T-Shirt","image_url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","subtitle":"100% Cotton, 200% Comfortable","default_action":{"type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"},"buttons":[{"title":"Shop Now","type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"https://peterssendreceiveapp.ngrok.io/"}]},{"title":"Classic Blue T-Shirt","image_url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","subtitle":"100% Cotton, 200% Comfortable","default_action":{"type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"},"buttons":[{"title":"Shop Now","type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"}]},{"title":"Classic Black T-Shirt","image_url":"http://phmedicalgroup.com/pizza/epm/WEDO.png","subtitle":"100% Cotton, 200% Comfortable","default_action":{"type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"},"buttons":[{"title":"Shop Now","type":"web_url","url":"http://phmedicalgroup.com/pizza/epm/","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"http://phmedicalgroup.com/pizza/epm/"}]}]}}};
	
var services = {"attachment":{"type":"template","payload":{"template_type":"list","top_element_style":"tall","elements":[{"title":"Classic White T-Shirt","image_url":"https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png","subtitle":"100% Cotton, 200% Comfortable","buttons":[{"title":"Buy","type":"web_url","url":"https://peterssendreceiveapp.ngrok.io/shop?item=100","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"https://peterssendreceiveapp.ngrok.io/"}]},{"title":"Classic Blue T-Shirt","image_url":"https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png","subtitle":"100% Cotton, 200% Comfortable","buttons":[{"title":"Buy","type":"web_url","url":"https://peterssendreceiveapp.ngrok.io/shop?item=101","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"https://peterssendreceiveapp.ngrok.io/"}]},{"title":"Classic Black T-Shirt","image_url":"https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png","subtitle":"100% Cotton, 200% Comfortable","buttons":[{"title":"Buy","type":"web_url","url":"https://peterssendreceiveapp.ngrok.io/shop?item=102","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"https://peterssendreceiveapp.ngrok.io/"}]},{"title":"Classic Gray T-Shirt","image_url":"https://peterssendreceiveapp.ngrok.io/img/gray-t-shirt.png","subtitle":"100% Cotton, 200% Comfortable","buttons":[{"title":"Buy","type":"web_url","url":"https://peterssendreceiveapp.ngrok.io/shop?item=103","messenger_extensions":true,"webview_height_ratio":"tall","fallback_url":"https://peterssendreceiveapp.ngrok.io/"}]}],"buttons":[{"title":"View More","type":"postback","payload":"payload"}]}}};
		
		sdk.reply(services);	
		
		//sdk.reply({text: "show Services.."});			
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
