onerror = function (msg) {
log(msg);
}
function log(msg) {
document.getElementById('log').appendChild(document.createTextNode(new Date() + ' ' + msg + '\n'));
}
function status(msg) {
log(msg);
document.getElementById('status').textContent = msg;
}
function clearLog() {
var e = document.getElementById('log');
while (e.hasChildNodes()) {
e.removeChild(e.firstChild);
}
e.appendChild(document.createTextNode('Log: \n'));
}
</script>

<script>
var socket = null;
function connect() {
log('Connecting to local server...');
if (socket == null) {
socket = io.connect(null,{'auto connect': false});
socket.on('connect', function () {
status('Connected');
});

socket.on('message', function (data) {
log(data);
});
}
socket.socket.connect();
}

function send() {
if (socket && socket.socket.connected) {
socket.send(document.getElementById('text').value);
log('>' + document.getElementById('text').value);
} else {
log('Not connected.');
}
}

function send100() {
if (socket && socket.socket.connected) {
for (var i = 0; i < 100; i += 1) {
socket.send('test'+ i);
log('> test' + i);
}
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
