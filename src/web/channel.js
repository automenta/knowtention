var Channel = function (initialData, connection) {

    if (typeof(initialData)==="string")
        initialData = { id: initialData };
    
    var c = {
        ui: null,
        data: initialData,
        socket: connection,
        prev: {},
        id: function () {
            return this.data.id;
        }
    };

    c.init = function (ui) {
        this.ui = ui;

        this.commit();
    };
    
    c.destroy = function() {
        
    };

    var synchPeriodMS = 1500;

    c.commit = _.throttle(function () {

        if (!this.socket.opened) {
            return;
        }

        //get positions
        var eles = this.ui.elements();
        var P = {};
        for (var i = 0; i < eles.length; i++) {
            var ele = eles[i];
            //console.log( ele.id() + ' is ' + ( ele.selected() ? 'selected' : 'not selected' ) );
            var p = ele.position();
            var x = p.x;
            if (!isFinite(x))
                continue;
            var y = p.y;
            P[ele.id()] = [parseInt(x), parseInt(y)];
        }
        this.data.p = P; //positions; using 1 character because this is updated frequently

        //https://github.com/Starcounter-Jack/Fast-JSON-Patch
        var diff = jsonpatch.compare(this.prev, this.data);

        this.prev = _.clone(this.data, true);

        if (diff.length > 0) {
            this.socket.send(['p' /*patch*/, this.data.id, diff]);
        }

    }, synchPeriodMS);

    return c;
};
