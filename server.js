var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, fu = require("./fu")
, slidesmodule = require("./module2")
, vote = require("./modules/vote/vote");

app.test = 5;

app.listen(process.env.PORT || 8001);

var clients = [ ];

var modules = [ ];

modules.push('vote');

app.loadedModules = [ ];

app.loadModules = function (){
    console.log("loadModules");

    for (var i=0; i < modules.length; i++) {    
        
        var moduleName = modules[i];
        var path = "./modules/" + moduleName;
        var js = path + "/" + moduleName + ".js";
        console.log(js);
        var loadedModule = require(js);
        app.loadedModules.push(loadedModule);
        
    }    
 
};

app.loadModuleContent = function(callback){
    app.content = "";
    for (var i=0; i < app.loadedModules.length; i++) {  
        //console.log(app.loadedModules[i]);
        if (typeof(app.loadedModules[i].content)==='function'){
            app.loadedModules[i].content(function(data){
                
                content = data;
                //console.log("data in callback : " + data);
                app.addModuleContent(content,function(){
                    //console.log("module content added");  
                        return callback(app.content);
                });
                
            });
        }
    
    }
    

};

app.addModuleContent = function(content,callback){
    app.content += content;   
    console.log("content : " + content);
    callback();
};


/*Vote.prototype = new slidesmodule.Module();
function Vote(){
    // Call super constructor.
    Module.apply( this, arguments );
}*/

app.loadModules();
/*
function loadModule(module){

    //var path = "modules/" + module;
    var js = require(path + "/" + module + ".js");
   // var content = path + "/" + module + ".content.html";

    

    console.log(path);
    console.log(js);
    console.log(content);

    var moduleData = {
        script:js, 
        content:content 
    }
    
    return moduleData;

}*/



function extname(path) {
    var index = path.lastIndexOf(".");
    return index < 0 ? "" : path.substring(index);
}

function handler (req, res) {
    
    if (req.url != "/"){

        var filename = req.url.replace("/","");

        var content_type = fu.mime.lookupExtension(extname(filename));

        fs.readFile(filename, function(err, data) {
            if (err) {
                    
                console.log("Error loading " + filename);
            }
            else {
                var body = String(data);
                
                //body = body.replace("##PORT##",process.env.PORT);
                //body = body.replace("##IP##",process.env.IP);
                var headers = {
                    "Content-Type": content_type,
                    "Content-Length": body.length
                };
                //if (!DEBUG) headers["Cache-Control"] = "public";

                res.writeHead(200, headers);
                res.end(req.method === "HEAD" ? "" : body);
            }
        });
    }else{    
        fs.readFile('index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            
            res.writeHead(200, {'Content-Type': 'text/html', "Content-Length": data.length});
            res.end(data);
        });
    }
}

io.sockets.on('connection', function (socket) {
    var index = clients.push(socket) - 1;
    console.log ("index " + index);
    // echo the message
    socket.on('message', function (data) {
        try {
            var json = JSON.parse(data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', data);
            return;
        }
        
        if (json.type == 'message'){
            console.log("!!!!!");
            //var moduleData = loadModule('vote');
            //console.log(moduleData);
            
            app.loadModuleContent(function(content){
            
                console.log("loadmodulecontent callback data: " + content);
            
                data = JSON.stringify({ type:'content', data: {id:'content',content: content} });
                app.sendData(data,function(){
                    console.log("Data sent");    
                
                })
                
                var Vote = function(){
                
                };
                Vote.prototype.vote= function(){
                        alert("you voted");
                        console.log("voted");
                    
                    };
                
                data = JSON.stringify({ type:'js', data: {object:Vote,name: 'Vote'} });
                console.log("Vote " + Vote);
                console.log("jsondata " + data);
                app.sendData(data,function(){
                    console.log("js Data sent");    
                
                })
                
            });
            
            
            
        }   
        
        if (json.type=='vote'){
            votes[json.data].numVotes ++;
            data = JSON.stringify({ type:'votes', data: votes });
        }        
        for (var i=0; i < clients.length; i++) {
            clients[i].send(data);
        }
    });
});

app.sendData = function(data,callback){      
    for (var i=0; i < clients.length; i++) {
        clients[i].send(data);
    }    
};
