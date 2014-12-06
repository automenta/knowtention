function websocketConnect(onOpen) {


    var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port + '/ws');

    ws.onopen = function () {

        this.opened = true;

        console.log('websocket connected');

        if (onOpen)
            onOpen(this);


    };
    ws.onmessage = function (e) {
        /*e.data.split("\n").forEach(function (l) {
         output(l, true);
         });*/

        console.log('websocket in', e.data);

    };
    ws.onclose = function () {
        //already disconnected?
        if (!this.opened)
            return;

        this.opened = false;

        console.log("Websocket disconnected");

        //attempt reconnect?
    };
    ws.onerror = function (e) {
        console.log("Websocket error", e);
    };

    return ws;

}


function jsonUnquote(json) {
    return json.replace(/\"([^(\")"]+)\":/g, "$1:");  //This will remove all the quotes
}
