/*
var Websocket = Connection.extend({
    
});
*/

/** creates a websocket connection object */
function Websocket(opt) {

    if (!opt) opt = { };
    
    if (!opt.url)
        opt.url = 'ws://' + window.location.hostname + ':' + window.location.port + '/ws';    
    

    var ws = opt.socket = new WebSocket(opt.url);

    ws.onopen = function () {

        opt.opened = true;

        console.log('websocket connected');

        if (opt.onOpen)
            opt.onOpen(this);


    };
    ws.onmessage = function (e) {
        /*e.data.split("\n").forEach(function (l) {
         output(l, true);
         });*/

        console.log('websocket in', e.data);

    };
    ws.onclose = function () {
        //already disconnected?
        if (!this.opt)
            return;

        opt.opened = false;

        console.log("Websocket disconnected");

        //attempt reconnect?
    };
    ws.onerror = function (e) {
        console.log("Websocket error", e);
    };

    opt.send = function(data) {
        var jdata = JSON.stringify(data);

        console.log('send:', jdata.length, jdata);

        this.socket.send(jdata);
    };

    opt.on = function(channelID, callback) {
        opt.send(['on', channelID]);
        
        //TODO save callback in map so when updates arrive it can be called
        
        callback.off = function() { opt.off(channelID); };
        
        return callback;
    };
    opt.off = function(channelID) {
        opt.send(['off', channelID]);
    };

    return opt;

}




function jsonUnquote(json) {
    return json.replace(/\"([^(\")"]+)\":/g, "$1:");  //This will remove all the quotes
}
