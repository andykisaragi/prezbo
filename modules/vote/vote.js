// can I pass a function through as data? don't see why not
// same as object...
// or an object containing all the functions
// Vote = new Vote;
// data = JSON.stringify({ type:'js', data: Vote });

var slidesmodule = require("./../../module2")
, fs = require('fs');

exports.Vote = function (){
    // Call super constructor.
    slidesmodule.slidesModule.apply( this, arguments );
};

exports.Vote.prototype = new slidesmodule.slidesModule();


exports.Vote.prototype.onMessage = function(json){
    if (json.type=='message'){
        //log(json.type);
        log(json.data);
    }
    
    if (json.type=='votes'){
        this.updateVotes(json.data);            
    }   
};


var votes = [ ];
var options = Array('Yes','No');

for (var i=0; i < options.length; i++) {
    votes.push({
      name: options[i],
      numVotes: 0
    });
}




exports.Vote.prototype.updateVotes = function(votes){
    
    ctx.fillStyle = "#eee";
    ctx.fillRect(0,0,350,350);

    var barWidth = 350 / votes.length;
    
    var totalVotes = 0;
    for (var i=0; i < votes.length; i++) {
        totalVotes += votes[i].numVotes;
    }
    
    for (var i=0; i < votes.length; i++) {
    
        var pct = votes[i].numVotes / totalVotes;
        var barHeight = 350 * pct;
        document.getElementById('vote' + votes[i].name).innerHTML = votes[i].numVotes + ' (' + (pct * 100) + '%)';
    
        ctx.fillStyle = colours[i];
        ctx.fillRect((i*barWidth) + 10,(350 - barHeight),barWidth - 20,barHeight);
    
    }
  
};

exports.Vote.prototype.vote = function(option) {
    if (socket && socket.socket.connected) {
        
        socket.send(JSON.stringify({ type:'vote', data: option }));
    } else {
        log('Not connected.');
    }
};

exports.content = function(callback){

    //console.log(fs.readdirSync("./"));

    var content = "?";

    fs.readFile('./modules/vote/vote.content.html',function(err,data){
        //console.log("data : " + data);
        content = data;
        //app.addModuleContent(content);
        callback(content);
    }
    );

    
};

exports.Vote.prototype.init = function(){
    var can = document.getElementById("canvas");
    var ctx = can.getContext("2d");
    var colours = new Array('#FF0000','0000FF','#00FF00','FF00FF','#FFFF00','00FFFF');
    
};

