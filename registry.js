'use strict';

module.exports = {
  components: {
//Smart Hospitality - Show Detail and Booking Flows
  'showHotelDetail' : require('./sh/showHotelDetail'),
  'search' : require('./sh/search'),
  'registerBooking' : require('./sh/registerBooking'),
  'newcustomer' : require('./sh/newcustomer'),
  'payment' : require('./sh/payment'),
  
  //Smart Hospitality - Pre-checking Flow
  'precheckinflow' : require('./sh/precheckinflow'),
  'requestPhoto' : require('./sh/requestPhoto'),
  'saveComments' : require('./sh/saveComments'),
  
  //Smart Hospitality - Room Number Flow
  'getRoomNumber' : require('./sh/getRoomNumber'),
  
  //Smart Hospitality - Set Room Temp. Flow
  'setRoomTemp' : require('./sh/setRoomTemp'),
  
  //Smart Hospitality - Open/Close Door Flow
  'openDoor' : require('./sh/openDoor'),  
  'closeDoor' : require('./sh/closeDoor'),
  
  //Smart Hospitality - Get Info Service Flow  
  'getInfoService' : require('./sh/getInfoService'),
  'getAllAvailableServices' : require('./sh/getAllAvailableServices'),  
  'MakeOrder' : require('./sh/MakeOrder'),  
 
  //Smart Hospitality - Checkout Flow
  'checkout' : require('./sh/checkout'),
  'saveFeedback' : require('./sh/saveFeedback'),
  
  //Helper
  'assignVariable' : require('./sh/assignVariable'),
  'conditionFromLastMessage' : require('./sh/conditionFromLastMessage')  
  
  }
};
