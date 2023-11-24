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