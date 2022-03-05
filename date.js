
exports.getDate = function(){ // module.exports is equal to exports...
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
const now = new Date();
return now.toLocaleDateString("en-US",options);
}

exports.getDay = function(){
const options = { weekday: 'long'};
const now = new Date();
return now.toLocaleDateString("en-US",options);
}
