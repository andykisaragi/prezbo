var socket = null;

// faking this for now, should be dynamic obvz
var modules = new Array('vote');

function init(){
    connect();    
}

function connect() {
    log('Connecting to local server...');
    if (socket == null) {
        socket = io.connect(null,{'auto connect': false});
        socket.on('connect', function () {
             status('Connected');
             module_onconnect();
        });
        socket.on('message', function (data) {
            
            try {
                var json = JSON.parse(data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', data);
                return;
            }

            module_onmessage(json);
            
        });
    }
    socket.socket.connect();
}

// TODO: generic hook-calling function

function module_onconnect(){
    for (var i=0; i < modules.length; i++) {
        var function_name = modules[i] + "_onconnect";
        console.log(function_name);
        window[function_name]();
    }
}

function module_onmessage(json){
    for (var i=0; i < modules.length; i++) {
        var function_name = modules[i] + "_onmessage";
        console.log(function_name);
        window[function_name](json);
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