/*
var Websocket = Connection.extend({
    
});
*/

/** creates a websocket connection object */
function Websocket(conn) {

    if (!conn) conn = { };
    
    if (!conn.url)
        conn.url = 'ws://' + window.location.hostname + ':' + window.location.port + '/ws';    
    
    //subscriptions: channel id -> channel
    conn.subs = { };
    

    var ws = conn.socket = new WebSocket(conn.url);

    ws.onopen = function () {

        conn.opened = true;

        console.log('websocket connected');

        if (conn.onOpen)
            conn.onOpen(this);


    };
    
    ws.onclose = function () {
        //already disconnected?
        if (!this.opt)
            return;

        conn.opened = false;

        console.log("Websocket disconnected");

        //attempt reconnect?
    };
    ws.onerror = function (e) {
        console.log("Websocket error", e);
    };

    conn.send = function(data) {
        var jdata = jsonUnquote( JSON.stringify(data) );
        
        console.log('send:', jdata.length, jdata);

        this.socket.send(jdata);
    };

    conn.handler = {
        channel: function(d) {
            //snapshot update
            notify(this, d);
            
        }

                
    };
    
    ws.onmessage = function (e) {
        /*e.data.split("\n").forEach(function (l) {
         output(l, true);
         });*/
        
        try {
            var d = JSON.parse(e.data);
            if (d[0]) {
                //array, first element = message type
                var messageHandler = conn.handler[d[0]];
                if (messageHandler) {
                    return conn.apply(messageHandler,d);
                }
            }
            
            notify('websocket data (unrecognized): ' + JSON.stringify(d));
        }
        catch (e) {
            notify('websocket text', e.data);
        }
    };
    
    conn.on = function(channelID, callback) {
        if (conn.subs[channelID])
            return; //already subbed
        
        conn.subs[channelID] = new Channel(channelID);
        
        conn.send(['on', channelID]);
        
        //TODO save callback in map so when updates arrive it can be called
        
        callback.off = function() { conn.off(channelID); };
        
        return callback;
    };
    
    conn.off = function(channelID) {
        if (!conn.subs[channelID]) return;
        
        delete conn.subs[channelID];
        
        conn.send(['off', channelID]);        
        
    };

    return conn;

}




function jsonUnquote(json) {
    return json.replace(/\"([^(\")"]+)\":/g, "$1:");  //This will remove all the quotes
}



function notify(x) {
    PNotify.desktop.permission();
    if (typeof x === "string")
        x = { text: x };
    else if (!x.text)
        x.text = '';
    if (!x.type)
        x.type = 'info';
    x.animation = 'none';
    x.styling = 'fontawesome';

    new PNotify(x);
    //.container.click(_notifyRemoval);
}


//faster than $('<div/>');
function newDiv(id) {
    var e = newEle('div');
    if (id)
        e.attr('id', id);
    return e;
}

function newEle(e, dom) {
    var d = document.createElement(e);
    if (dom)
        return d;
    return $(d);
}
