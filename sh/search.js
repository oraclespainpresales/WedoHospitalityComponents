"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

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
		/*var args = {		
			requestConfig: {
				timeout: 100000, //request timeout in milliseconds 
				noDelay: true, //Enable/disable the Nagle algorithm 
				keepAlive: true, //Enable/disable keep-alive functionalityidle socket. 
				keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent 
			},
			responseConfig: {
				timeout: 100000 //response timeout 
			}
		};*/
		var args = {			
			headers: { "Content-Type": "application/json" }
		};

		//console.log("http://new.soa.digitalpracticespain.com:8001/smarthospitality/cached/hotels/MADRID/"+city);
		var req=client.get("http://new.soa.digitalpracticespain.com:8001/smarthospitality/hotels/MADRID/"+city, args,function (data, response) {
			//console.log("url:: "+"http://new.soa.digitalpracticespain.com:8001/smarthospitality/hotels/MADRID/"+city);
			console.log("DATA:::" +JSON.stringify(data));
		// console.log("DATA:::" +data);
		//	var jdata=JSON.parse(data);
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
				
				/*while (i<nhotels)
				{
					if (jdata[i].from.type.toUpperCase()==roomType.toUpperCase())
					{
						//console.log("si es de ese tipo de hab la "+i);
						hotels[j]=jdata[i];
						j++;						
					}else{
						console.log("NO es de ese tipo de hab la "+i);
					}
					i++;
					
				}*/
			}else{
				sdk.reply({text: "There are no hotels availables in "+city+" "+roomType});						
			}
		
		
				if (canal=='webhook')
				{		
						for (var i=0;i<jdata.length;i++)
						{
							//sdk.reply({text: "Hotel: "+jdata[i].internalname});	
							var boton="show info. of "+jdata[i].internalname;		
							sdk.reply({text: "Hotel: "+jdata[i].internalname, choices: boton.split(',')});							
							sdk.reply({text: "Location: "+ jdata[i].address+" \nPrice from:"+ jdata[i].from.price+"€ "});
						}
						
						sdk.action('success');        
						sdk.done(true);	
						done(sdk);			

				}else{	
						console.log("jdata:: "+JSON.stringify(jdata));
						var carrousel = [];						
						for (var i=0;i<jdata.length;i++)
						{
							carrousel[i]={
								"title":jdata[i].internalname,
								"subtitle":jdata[i].address+" Price from: "+ jdata[i].from.price+"€ ",
								"image_url": jdata[i].images[0],
								"buttons":[
								  {
									"type":"postback",
									"title":"Detail "+jdata[i].internalname,
									"payload":"show info of data "+jdata[i].internalname
								  }
								]
							  };
						}  
					
						var cardv2 = {"attachment":{"type":"template","payload":{"template_type":"generic","elements":carrousel}}};
						sdk.reply(cardv2);
						
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
