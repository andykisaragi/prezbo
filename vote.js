
function vote_onconnect(){

}

function vote_onmessage(json){
 
    if (json.type=='message'){
        //log(json.type);
        log(json.data);
    }
    
    if (json.type=='votes'){
        updateVotes(json.data);            
    }


}


// send message from text box thing
function send() {
    if (socket && socket.socket.connected) {
        socket.send(JSON.stringify({ type:'message', data:document.getElementById('text').value}));
        log('>' + document.getElementById('text').value);
    } else {
        log('Not connected.');
    }
}


var can = document.getElementById("canvas");
var ctx = can.getContext("2d");
var colours = new Array('#FF0000','0000FF','#00FF00','FF00FF','#FFFF00','00FFFF');

function updateVotes(data){
    
    ctx.fillStyle = "#eee";
    ctx.fillRect(0,0,350,350);
    
    var votes = data;
    
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
        ctx.fillRect(i*barWidth,(350 - barHeight),barWidth,barHeight);
    
    }
    


}

function vote(option) {
    if (socket && socket.socket.connected) {
        
        socket.send(JSON.stringify({ type:'vote', data: option }));
    } else {
        log('Not connected.');
    }
}

