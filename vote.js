var socket = null;

var can = document.getElementById("canvas");
var ctx = can.getContext("2d");
var colours = new Array('#FF0000','0000FF','#00FF00','FF00FF','#FFFF00','00FFFF');
    

function init(){
    connect();    
}

function connect() {
    log('Connecting to local server...');
    if (socket == null) {
        socket = io.connect(null,{'auto connect': false});
        socket.on('connect', function () {
             status('Connected');
        });
        
        socket.on('message', function (data) {
            
            try {
                var json = JSON.parse(data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', data);
                return;
            }
            
            if (json.type=='message'){
                //log(json.type);
                log(json.data);
            }
            
            if (json.type=='votes'){
                updateVotes(json.data);            
            }
            
        });
    }
    socket.socket.connect();
}

function send() {
    if (socket && socket.socket.connected) {
        socket.send(JSON.stringify({ type:'message', data:document.getElementById('text').value}));
        log('>' + document.getElementById('text').value);
    } else {
        log('Not connected.');
    }
}

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

function update() {
    if (socket && socket.socket && socket.socket.transport) {
        document.getElementById('sessionId').textContent = socket.socket.transport.sessid;
        document.getElementById('transport').textContent = socket.socket.transport.name;
    } else {
        document.getElementById('sessionId').textContent = '-';
        document.getElementById('transport').textContent = '-';
    }
}

setInterval(update, 10);