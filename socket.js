
var socket = null;

// faking this for now, should be dynamic obvz
var modules = [ ];

connect();  
//loadModules();
//var Vote = new Vote();
//modules.push(Vote);

function connect() {
    log('Connecting to local server...');
    if (socket == null) {
        socket = io.connect(null,{'auto connect': false});
        socket.on('connect', function () {
             status('Connected');
             module_onconnect();
        });
        socket.on('message', function (data) {
            
            console.log("jsondata : " + data);
            try {
                var json = JSON.parse(data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', data);
                return;
            }


            if (json.type == 'content'){
                
                console.log(json);
                
                if(json.data.content && json.data.id){
                    
                    console.log(json.data.content);
                        
                    document.getElementById(json.data.id).innerHTML = json.data.content;
                
                }
            
            }
            
            if(json.type == 'js'){
            
                if(json.data.object && json.data.name){ 
                    window[json.data.name] = json.data.object;
                }
                
                
            }

            //module_onmessage(json);
            
        });
    }
    socket.socket.connect();
}

// TODO: generic hook-calling function

//function prez_hook(hook,vars)

function module_onconnect(){
    for (var i=0; i < modules.length; i++) {
        /*var function_name = "onconnect";
        console.log(function_name);
        window[function_name]();*/
        
    }
}

function module_onmessage(json){
    for (var i=0; i < modules.length; i++) {
        /*var function_name = modules[i] + "_onmessage";
        console.log(function_name);
        window[function_name](json);*/
        modules[i].onMessage(json);
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