function Module(){
    
}

Module.prototype.onConnect = function(){
    console.log("default module onconnect");
    // do nothing
};

Module.prototype.onMessage = function(data){
    console.log("default module onmessage");
    // do nothing
};

Module.prototype.content = function(){
    return false;
};

Module.prototype.init = function(){
    return false;
};
Module.prototype.load = function(){
    return false;
};