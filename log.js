onerror = function (msg) {
    log(msg);
};
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