var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, fu = require("./fu")


app.listen(process.env.PORT || 8001);

var clients = [ ];
var votes = [ ];
var options = Array('Yes','No');

for (var i=0; i < options.length; i++) {
    votes.push({
      name: options[i],
      numVotes: 0
    });
}

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
                body = body.replace("##PORT##",process.env.PORT);
                body = body.replace("##IP##",process.env.IP);
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
        if (json.type=='vote'){
            votes[json.data].numVotes ++;
            data = JSON.stringify({ type:'votes', data: votes })
        }        
        for (var i=0; i < clients.length; i++) {
            
            clients[i].send(data);
        }
    });
});