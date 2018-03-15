'use strict';

module.exports = {
  components: {

////Smart Hospitality - Show Detail and Booking Flows
	  'hospitality.showHotelDetail' : require('./sh/showHotelDetail'),
	  'hospitality.search' : require('./sh/search'),
	  'hospitality.registerBooking' : require('./sh/registerBooking'),
	  'hospitality.newcustomer' : require('./sh/newcustomer'),
	  'hospitality.payment' : require('./sh/payment'),
	  'hospitality.showPaymentMethod' : require('./sh/showPaymentMethod'),			  
	  //Smart Hospitality - Pre-checking Flow
	  'hospitality.precheckinflow' : require('./sh/precheckinflow'),
	  'hospitality.requestPhoto' : require('./sh/requestPhoto'),
	  'hospitality.saveComments' : require('./sh/saveComments'),
	  'hospitality.updateSocialID' : require('./sh/updateSocialID'),			  
	  //Smart Hospitality - Room Number Flow
	  'hospitality.' : require('./sh/getRoomNumber'),			  
	  //Smart Hospitality - Set Room Temp. Flow
	  'hospitality.setRoomTemp' : require('./sh/setRoomTemp'),			  
	  //Smart Hospitality - Open/Close Door Flow
	  'hospitality.openDoor' : require('./sh/openDoor'),  
	  'hospitality.closeDoor' : require('./sh/closeDoor'),			  
	  //Smart Hospitality - Get Info Service Flow  
	  'hospitality.getInfoService' : require('./sh/getInfoService'),
	  'hospitality.getAllAvailableServices' : require('./sh/getAllAvailableServices'),  
	  'hospitality.MakeOrder' : require('./sh/MakeOrder'),			 
	  //Smart Hospitality - Checkout Flow
	  'hospitality.checkout' : require('./sh/checkout'),
	  'hospitality.saveFeedback' : require('./sh/saveFeedback'),
	  'hospitality.invoiceConfirmed' : require('./sh/invoiceConfirmed'),
	  'hospitality.feedbackQuestion' : require('./sh/feedbackQuestion'),			  
	   //Smart Hospitality - ASK WeDo Points
	  'hospitality.getWedoPoints' : require('./sh/getWedoPoints'),			  
	  //Helper
	  'hospitality.assignVariable' : require('./sh/assignVariable'),
	  'hospitality.conditionFromLastMessage' : require('./sh/conditionFromLastMessage')
  }
};
