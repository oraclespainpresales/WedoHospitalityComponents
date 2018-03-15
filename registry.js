'use strict';

module.exports = {
  components: {
  //AEAT
		'aeat.proccessFaq': require('./aeat/proccessFaq'),  
		

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
	  'hospitality.conditionFromLastMessage' : require('./hospitality/conditionFromLastMessage'),
  
	  //IKEA
	  'ikea.getPhoto': require('./ikea/getPhoto'),  
	  'ikea.showModels': require('./ikea/showModels'),  
	  
	  //IOT Racing
	  'iotracing.PasswordChecker' : require('./iotracing/password_checker'),
	  'iotracing.InfoRace': require('./iotracing/info_race'),
	  'iotracing.LaunchingDrone': require('./iotracing/launching_drone'),
	  'iotracing.RequestPicture': require('./iotracing/request_picture'),
	  'iotracing.RequestDetailCar': require('./iotracing/detail_car'),
	  'iotracing.ShowTeam': require('./iotracing/show_team'),    
	  'iotracing.LaunchRace': require('./iotracing/launch_race'),  
	  'iotracing.StopRace': require('./iotracing/stop_race'),    
	  'iotracing.CreateIncident': require('./iotracing/create_incident'),    
	  'utiliotracing.ActionFromVariable': require('./utiliotracing/action_from_variable'),
	  'utiliotracing.resolveIntent': require('./utiliotracing/resolveIntent'),
	  'utiliotracing.multipleOutputs': require('./utiliotracing/multipleOutputs'),
	  'utiliotracing.setVariableFromUserInput': require('./utiliotracing/setVariableFromUserInput'),
	  'utiliotracing.ConditionalIsNull': require('./utiliotracing/conditional_is_null'),

	  //Madrid Digital  
	  'madriddigital.RequestForm': require('./madriddigital/request_form'),  
	  'madriddigital.showPaymentMethod': require('./madriddigital/showPaymentMethod'),
	  'madriddigital.assignVariable': require('./madriddigital/assignVariable'),
	  'madriddigital.RequestPayment': require('./madriddigital/RequestPayment'),
	  'madriddigital.processPayment': require('./madriddigital/processPayment'),
	  'madriddigital.conditionFromLastMessage' : require('./madriddigital/conditionFromLastMessage'),
	  
	  //Marketing Events
	  //	./mktEvents/..
	  
	  
	  //oow17
	  'oow17.whoiswho' : require('./oow17/whoiswho'),
	  'oow17.contact' : require('./oow17/contact'),
	  'oow17.agenda' : require('./oow17/agenda'),
	  'oow17.agendadetallada' : require('./oow17/agendadetallada'),
	  'oow17.infointeres' : require('./oow17/infointeres'),
	  'oow17.dresscode' : require('./oow17/dresscode'),    
	  'oow17.hoteles' : require('./oow17/hoteles'),    
	  'oow17.moreAgenda' : require('./oow17/moreAgenda'),

	   //Banking Bot v2
	  'bankingv2.convertLoanTenorYearsToMonths' : require('./bankingv2/convertLoanTenorYearsToMonths'),
	  'bankingv2.setVariableFromUserInput' : require('./bankingv2/setVariableFromUserInput'),
	  'bankingv2.setVariableOriginalInput' : require('./bankingv2/setVariableOriginalInput'),
	  'bankingv2.getUserAccountsWithSufficientAmount' : require('./bankingv2/getUserAccountsWithSufficientAmount'),
	  'bankingv2.getNumber' : require('./bankingv2/getNumber'),
	  'bankingv2.determineState' : require('./bankingv2/determineState'),
	  'bankingv2.initiateChate' : require('./bankingv2/ServiceCloud/initiateChate'),
	  'bankingv2.setChatPassedIntent' : require('./bankingv2/ServiceCloud/setChatPassedIntent'),
	  'bankingv2.sendChatMessage' : require('./bankingv2/ServiceCloud/sendChatMessage'),
	  'bankingv2.getFaqAnswers' : require('./bankingv2/ServiceCloud/getFaqAnswers'),
	  'bankingv2.exitChat' : require('./bankingv2/ServiceCloud/exitChat'),

	 //MegaPizza v2
	 'megapizza.getAddress' : require('./megapizza/getAddress'),
	 'megapizza.getStepsToAddress' : require('./megapizza/getStepsToAddress'),
	 
	  'GetEventData': require('./mktEvents/get_event_data'),
	  'GetAgendaData': require('./mktEvents/get_agenda_data'),
	  'GetSlotDetailed': require('./mktEvents/get_slot_detailed'),
	  'GetGlobalVote': require('./mktEvents/get_global_vote'),
	  'GetVote': require('./mktEvents/get_vote'),
	  'SetVote': require('./mktEvents/set_vote'),
	  'SaveFeedbackData': require('./mktEvents/save_feedback_data'),
	  'GetValidation': require('./mktEvents/get_validation'),
	  'FeedbackCompleted': require('./mktEvents/feedback_completed'),
	  'VotesCompleted': require('./mktEvents/votes_completed'),
	  'ConditionAgain': require('./mktEvents/get_conditionagain')
	 
	 
  }
};
