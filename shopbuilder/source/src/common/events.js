/*
    Ry: Zendesk starts to have issue with .trigger() .on()
    It could be because we use name with "." that causes issue in it
        e.g. 
        
        .on("ll.setPinWindow",...)         
        .on("main.setPinWindow",...) 

        dont receive any event/data with
        .trigger("ll.setPinWindow")
        .trigger("main.setPinWindow")

    To avoid such thing, we stop using ZAFv2 for internal app events, but do it ourself here

    We bind it to window.llEvents for global scope to use across all apps (e.g. Q and Seek)

*/
const events = {};
const eventsWKey = {};


const on = (eventName, callback, uniqueKey) => {
  if (uniqueKey){
    eventsWKey[uniqueKey] = callback;
  }
  else{
    events[eventName] = events[eventName] || [];
    events[eventName].push(callback);
  }
};

const trigger = (eventName, data, uniqueKey) => {
  if (uniqueKey){
    if (!eventsWKey[uniqueKey]) return;
    eventsWKey[uniqueKey](data);
  }
  else{
    if (!events[eventName]) return;
    events[eventName].forEach(callback => callback(data));
  }
};

export default {
    on: on,
    trigger: trigger
};