exports.slidesModule = function(){
    
};

exports.slidesModule.prototype.onConnect = function(){
    console.log("default module onconnect");
    // do nothing
};

exports.slidesModule.prototype.onMessage = function(data){
    console.log("default module onmessage");
    // do nothing
};

exports.slidesModule.prototype.content = function(){
    return false;
};

exports.slidesModule.prototype.init = function(){
    return false;
};
exports.slidesModule.prototype.load = function(){
    return false;
};