'use strict';

module.exports = {
  components: {

////Smart Hospitality - Show Detail and Booking Flows
	  'hospitality.showHotelDetail' : require('./hospitality/showHotelDetail'),
	  'hospitality.search' : require('./hospitality/search'),
	  'hospitality.registerBooking' : require('./hospitality/registerBooking'),
	  'hospitality.newcustomer' : require('./hospitality/newcustomer'),
	  'hospitality.payment' : require('./hospitality/payment'),
	  'hospitality.showPaymentMethod' : require('./hospitality/showPaymentMethod'),			  
	  //Smart Hospitality - Pre-checking Flow
	  'hospitality.precheckinflow' : require('./hospitality/precheckinflow'),
	  'hospitality.requestPhoto' : require('./hospitality/requestPhoto'),
	  'hospitality.saveComments' : require('./hospitality/saveComments'),
	  'hospitality.updateSocialID' : require('./hospitality/updateSocialID'),			  
	  //Smart Hospitality - Room Number Flow
	  'hospitality.' : require('./hospitality/getRoomNumber'),			  
	  //Smart Hospitality - Set Room Temp. Flow
	  'hospitality.setRoomTemp' : require('./hospitality/setRoomTemp'),			  
	  //Smart Hospitality - Open/Close Door Flow
	  'hospitality.openDoor' : require('./hospitality/openDoor'),  
	  'hospitality.closeDoor' : require('./hospitality/closeDoor'),			  
	  //Smart Hospitality - Get Info Service Flow  
	  'hospitality.getInfoService' : require('./hospitality/getInfoService'),
	  'hospitality.getAllAvailableServices' : require('./hospitality/getAllAvailableServices'),  
	  'hospitality.MakeOrder' : require('./hospitality/MakeOrder'),			 
	  //Smart Hospitality - Checkout Flow
	  'hospitality.checkout' : require('./hospitality/checkout'),
	  'hospitality.saveFeedback' : require('./hospitality/saveFeedback'),
	  'hospitality.invoiceConfirmed' : require('./hospitality/invoiceConfirmed'),
	  'hospitality.feedbackQuestion' : require('./hospitality/feedbackQuestion'),			  
	   //Smart Hospitality - ASK WeDo Points
	  'hospitality.getWedoPoints' : require('./hospitality/getWedoPoints'),			  
	  //Helper
	  'hospitality.assignVariable' : require('./hospitality/assignVariable'),
	  'hospitality.conditionFromLastMessage' : require('./hospitality/conditionFromLastMessage')
  }
};
