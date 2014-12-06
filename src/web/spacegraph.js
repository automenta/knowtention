function spacegraph(target, opt) {
    
    var ready = function() {
        
        opt.start();
                

        //http://js.cytoscape.org/#events/collection-events
        //
        this.on('data position select unselect add remove grab drag style', function (evt) {
            /*console.log( evt.data.foo ); // 'bar'
             
             var node = evt.cyTarget;
             console.log( 'tapped ' + node.id() );*/

            var target = evt.cyTarget;
            if (widget(target))
                queueWidgetUpdate(target);

            commit();
        });

        var widgetsToUpdate = {};

//            var baseRedraw = this._private.renderer.redraw;
//            this._private.renderer.redraw = function(options) {
//
//                
//                baseRedraw.apply(this, arguments);
//            };

        var baseDrawNode = this._private.renderer.drawNode;
        this._private.renderer.drawNode = function (context, node, drawOverlayInstead) {
            baseDrawNode.apply(this, arguments);

            if (widget(node)) {
                queueWidgetUpdate(node);
            }
        };

        function widget(node) {
            return node.data().widget;
        }

        function queueWidgetUpdate(node) {
            widgetsToUpdate[node.id()] = node;
            updateWidgets();
        }

        var updateWidgets = _.throttle(function () {

            var nextWidgetsToUpdate = _.values(widgetsToUpdate);

            if (nextWidgetsToUpdate.length > 0) {
                widgetsToUpdate = {};

                setTimeout(function () {

                    for (var i = 0; i < nextWidgetsToUpdate.length; i++) {
                        var node = nextWidgetsToUpdate[i];
                        updateNodeWidget(node);
                    }

                }, 0);
            }

        }, 10);

        var widgets = new WeakMap();

        function updateNodeWidget(node) {
            var widget = node.data().widget; //html string
            var w = widgets.get(node);

            function setWidgetHTML() {
                w.html(widget.html).data('when', Date.now());
            }

            /*if (w) {
             var whenLastModified = w.data('when');
             if (whenLastModified < Date.now()) {
             
             }
             }*/

            if (!w) {

                var style = widget.style || {};
                style.position = 'fixed';
                style.transformOrigin = '0 0';

                //var wid = 'widget_' + node.getID();
                w = $('<div></div>').
                        //attr('id', wid).
                        addClass('widget').
                        css(style).
                        appendTo('#widgets');

                setWidgetHTML();

                function commitWidgetChange(e) {

                    //this is probably less efficient than going from DOM to JSON directly
                    var html = html2json(w.html());

                    //console.log(html);

                    if (html !== widget.html) {
                        widget.html = html;
                        commit();
                    }
                }

                w.bind("DOMSubtreeModified", commitWidgetChange); // Listen DOM changes

                widgets.set(node, w);
            }


            var pos = node.renderedPosition();
            var pw = node.renderedWidth();
            var ph = node.renderedHeight();
            var paddingScale = (widget.padding || 0);

            var ps = Math.min(pw, ph) * (1.0 - paddingScale);

            var widgetScale = widget.scale;
            var wx = ps * widgetScale;

            var nextCSS = {};
            if (widget.minPixels) {
                var hidden = 'none' === w.css('display');

                if (ps < widget.minPixels) {
                    if (!hidden) {
                        w.css({display: 'none'});
                        return;
                    }
                }
                else {
                    if (hidden) {
                        nextCSS['display'] = 'block';
                    }
                }
            }

            var mata, matb, matc, matd, mate, matf;
            mata = wx;
            matb = 0;
            matc = 0;
            matd = wx;
            mate = parseInt(pos.x - pw / 2 + pw * paddingScale / 2.0);
            matf = parseInt(pos.y - ph / 2 + ph * paddingScale / 2.0);
            nextCSS['transform'] = 'matrix(' + mata + ',' + matb + ',' + matc + ',' + matd + ',' + mate + ',' + matf + ')';
            w.css(nextCSS);
        }


//            function scaleAndTranslate( _element , _x , _y, wx, wy )  {
//                
//                var mat = _element.style.transform.baseVal.getItem(0).matrix;
//                // [1 0 0 1 tx ty], 
//                mat.a = wx; mat.b = 0; mat.c = 0; mat.d = wy; mat.e = _x; mat.f = _y;
//                
//            }        
    };
    
    opt = _.defaults(opt, {
        layout: {
            name: 'cose',
            padding: 5
        },
        ready: ready,
        // initial viewport state:
        zoom: 1,
        pan: {x: 0, y: 0},
        // interaction options:
        minZoom: 1e-50,
        maxZoom: 1e50,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        userPanningEnabled: true,
        selectionType: 'single',
        boxSelectionEnabled: false,
        autolock: false,
        autoungrabify: false,
        autounselectify: false,
        // rendering options:
        headless: false,
        styleEnabled: true,
        hideEdgesOnViewport: false,
        hideLabelsOnViewport: false,
        textureOnViewport: false, //true = higher performance, lower quality
        motionBlur: true,
        wheelSensitivity: 1,
        //pixelRatio: 1
        initrender: function (evt) { /* ... */
        }
        //renderer: { /* ... */},

    });
    
    var c = target.cytoscape(opt);
    c.channels = { };
    
    c.addChannel = function(c) {
        
        this.channels[c.id()] = c;
        
        if (c.ui!==this)
            c.init(this);
        
        //  style: channel.style,
        //  elements: channel.elements            

    };
    
    return c;
};
