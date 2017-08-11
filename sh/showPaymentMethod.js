"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var UIBuilder = require('./UIBuilder');

module.exports = {

    metadata: () => ({
        "name": "showPaymentMethod",
        "properties": {
			"options": { "type": "string", "required": true}
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const text = sdk.text();		  
        logger.info('showPaymentMethod');
		var options = sdk.properties().options;
       // console.log("options: "+options);
		
		//sdk.reply({text: "showPaymentMethod..."});			
		var canal="";					
		if (sdk.channelType() == "facebook") {
			console.log("es FACEBOOK");
			canal="facebook";			
			
			var carrousel = [];						
			carrousel[0]={
				"title":"Credit Card",
				"subtitle":"Visa, MasterCard, Amex",
				"image_url": "http://www.telegraph.co.uk/content/dam/personal-banking/2016/02/21/PD53874821_BBPKF6-_2819435a-xlarge_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg",
				"buttons":[
				  {
					"type":"postback",
					"title":"Credit Card",
					"payload":"Credit Card"
				  }
				]
			  };
			  
			  carrousel[1]={
				"title":"Paypal",
				"subtitle":"Global Purchase Protection",
				"image_url": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
				"buttons":[
				  {
					"type":"postback",
					"title":"Paypal",
					"payload":"Paypal"
				  }
				]
			  };
			
		
			var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
			sdk.reply(cardv2)
				
			
			var buttons="Back";
			buttons = buttons.split(',');
			var finalBUttons = [];
			buttons.forEach(function (button) {
				finalBUttons.push({title: button, payload: 'BACK_SEARCH'});
			});
			var uiBuilder = new UIBuilder(sdk.channelType());
			var payload = uiBuilder.buildButtons("No, I will come back...", finalBUttons);
			sdk.reply(payload);
		}
		else {
			console.log("es WEBHOOK");
			canal="webhook";
			
			var botones=[];
			botones="Credit Card,Paypal,Back";
			sdk.reply({text: "Choose an option", choices: botones.split(',')});

		}
		
		
		sdk.action('success');        
		sdk.done(true);	
		done(sdk);
	}
			
//	}
}
