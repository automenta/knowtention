function spacegraph(ui, target, opt) {
    
    var ready = function() {

        var that = this;
        
        opt.start(this);
                

        //http://js.cytoscape.org/#events/collection-events
        //
        this.on('data position select unselect add remove grab drag style', function (e) {
            /*console.log( evt.data.foo ); // 'bar'
             
             var node = evt.cyTarget;
             console.log( 'tapped ' + node.id() );*/

            var target = e.cyTarget;
            if (widget(target))
                queueWidgetUpdate(target);

            this.commit();
        });
        

        //overlay framenode --------------
        
        var frame = $('#nodeframe');
        var hovered = null;
        var frameVisible = false;
        var frameTimeToFade = 2000; //ms
        var frameHiding = -1;
        var frameNodeScale = 1;
        var frameNodeMargin = -0.25;
        
        this.on('pan zoom', function(e) {
            setTimeout(hoverUpdate, 0);
        });
        
        this.on('mouseover mouseout mousemove', function(e) {
            
            var target = e.cyTarget;
            var over = (e.type !== "mouseout");
                        
            
            if (target && target.isNode && target.isNode()) {                
                if (over || (hovered!==target)) {
                    //cancel any hide fade
                    clearTimeout(frameHiding);
                    frameHiding = -1;
                }
                
                if (hovered!==target) {
                    frame.hide();
                    frameVisible = true;
                    frame.fadeIn();
                    hovered = target;
                }
            } else {
                frameVisible = false;
            }
            
            setTimeout(hoverUpdate, 0);
            
        });
        
        function hoverUpdate() {
            var currentlyVisible = frame.is(':visible');
            if (frameVisible) {
                if (!currentlyVisible)
                    frame.fadeIn();
            }
            else {                
                if ((frameHiding===-1) && (currentlyVisible)) {
                    frameHiding = setTimeout(function() {
                        //if still set for hiding, actually hide it
                        if (!frameVisible)
                            frame.fadeOut(function() {
                                hovered = null;
                            });

                        frameHiding = -1;
                    }, frameTimeToFade);                
                }
            }
            if (currentlyVisible && hovered) {
                positionNodeHTML(hovered, frame, frameNodeScale, frameNodeMargin);
            }
            
        }
        
        // ----------------------
        
        this.on('cxttapstart', function(e) {
            var target = e.cyTarget;
            
            if (!target) {                
                zoomTo();
            }
            else {
                zoomTo(target);
            }
        });
        

        
        // ------------------------
        
        // zoom handler

        var widgetsToUpdate = {};

        var baseRedraw = this._private.renderer.redraw;
        this._private.renderer.redraw = function(options) {
            baseRedraw.apply(this, arguments);

            hoverUpdate();
            updateWidgets();
        };

        var baseDrawNode = this._private.renderer.drawNode;
        this._private.renderer.drawNode = function (context, node, drawOverlayInstead) {
            baseDrawNode.apply(this, arguments);

            if (widget(node)) {
                queueWidgetUpdate(node);
                if (hovered === node)
                    setTimeout(hoverUpdate, 0);
            }
        };

        function widget(node) {
            return node.data().widget;
        }

        function queueWidgetUpdate(node) {
            widgetsToUpdate[node.id()] = node;
        }

        var updateWidgets = _.throttle(function () {

            var nextWidgetsToUpdate = _.values(widgetsToUpdate);

            if (nextWidgetsToUpdate.length > 0) {

                setTimeout(function () {
                    widgetsToUpdate = {};

                    for (var i = 0; i < nextWidgetsToUpdate.length; i++) {
                        var node = nextWidgetsToUpdate[i];
                        updateNodeWidget(node);
                    }

                }, 0);
            }

        }, 10);

        

        
        function updateNodeWidget(node) {
            var widget = node.data().widget; //html string
            var w = that.widgets.get(node);

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
                    
                    var oh = w[0].innerHTML;
                    
                    //this is probably less efficient than going from DOM to JSON directly
                    var html = html2json(oh);

                    if (html !== widget.html) {
                        widget.html = html;
                        
                        //TODO only commit the channel this node belongs to
                        that.commit();
                    }
                }

                //TODO use MutationObservers
                w.bind("DOMSubtreeModified DOMAttrModified", commitWidgetChange); // Listen DOM changes

                that.widgets.set(node, w);
            }

            positionNodeHTML(node, w, widget.scale, widget.padding, widget.minPixels);

        }


//            function scaleAndTranslate( _element , _x , _y, wx, wy )  {
//                
//                var mat = _element.style.transform.baseVal.getItem(0).matrix;
//                // [1 0 0 1 tx ty], 
//                mat.a = wx; mat.b = 0; mat.c = 0; mat.d = wy; mat.e = _x; mat.f = _y;
//                
//            }        
    };
    
    
    /** html=html dom element */
    function positionNodeHTML(node, html, scale, padding, minPixels) {
        
        /*if (!node.visible()) {
            html.hide();
            return;
        }
        else {
            html.show();
        }*/

        var pos = node.renderedPosition();
        var pw = node.renderedWidth();
        var ph = node.renderedHeight();
        
        var paddingScale = (padding || 0);       

        scale = scale || 1;
        
        var cw = html[0].clientWidth;
        var ch = html[0].clientHeight;
        if (cw === 0 || ch === 0) {
            return;
        }
        
        var globalToLocalW = pw / cw;
        var globalToLocalH = ph / ch;
        
        //var globalToLocal = Math.min(globalToLocalW, globalToLocalH);        
        //var wx = scale * globalToLocal * (1.0 - paddingScale) ;
        
        var wx = scale * globalToLocalW * (1.0 - paddingScale);
        var wy = scale * globalToLocalH * (1.0 - paddingScale);
        
        var aspectRatio = true;
        if (aspectRatio) {
            wx = wy = Math.min(wx, wy);
        }

                    
        //TODO check extents to determine node visibility for hiding off-screen HTML
        //for possible improved performance

        var nextCSS = {};
        if (minPixels) {
            var hidden = 'none' === html.css('display');

            if (/*wx < minPixels*/ false) {
                if (!hidden) {
                    html.css({display: 'none'});
                    return;
                }
            }
            else {
                if (hidden) {
                    nextCSS['display'] = 'block';
                }
            }
        }

        var mata, matb, matc, matd, px, py;
        mata = wx;
        matb = 0;
        matc = 0;
        matd = wy;
                
        //parseInt here to reduce precision of numbers for constructing the matrix string
        //TODO replace this with direct matrix object construction involving no string ops        
        px = parseInt(pos.x - pw / 2 + pw * paddingScale / 2.0); //'e' matrix element
        py = parseInt(pos.y - ph / 2 + ph * paddingScale / 2.0); //'f' matrix element
        //px = pos.x;
        //py = pos.y;
        nextCSS['transform'] = 'matrix(' + mata + ',' + matb + ',' + matc + ',' + matd + ',' + px + ',' + py + ')';
        html.css(nextCSS);        
    }
    
    
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
        initrender: function (evt) { /* ... */ },
        //renderer: { /* ... */},
        container: target[0]
    });
    
    
    var s = cytoscape(opt);
    
    s.channels = { };
    s.widgets = new WeakMap(); //node -> widget
    
    function wrapInData(d) {
        var w = { data: d };
        if (d.style)
            w.css = d.style;
        return w;
    }
    
    s.addChannel = function(c) {
        
        this.channels[c.id()] = c;
        
        if (c.ui!==this)
            c.init(this);
                       
        //fuckup (unnecessarily complexify with redundancy) the nodes/edges format so cytoscape can recognize it
        var e = {
            nodes: c.data.nodes.map(wrapInData), // c.data.nodes,
            edges: c.data.edges.map(wrapInData) //c.data.edges
        };        
        
        //fuckup (unnecessarily complexify with redundancy) the style format so cytoscape can recognize it
        if (c.data.style) {
            var s = [       ];
            for (sel in c.data.style) {
                s.push({
                   selector: sel,
                   css: c.data.style[sel]
                });
            }

            if (s.length > 0) {
                //TODO merge style; this will replace it with c's        

                this.style().clear();        

                this.style().fromJson(s);
                this.style().update();
            }
        }
        
        this.add( e );

        this.resize();
        
        /*
        setTimeout(function() {
            s.layout();
        }, 0);
        */
       
        ui.addChannel(this, c);
    };
    
    s.removeChannel = function(c) {

        //remove all nodes, should remove all connected edges too
        for (var i = 0; i < c.data.nodes; i++) {
            var nodeID = c.data.nodes[i].id;
            this.remove('#' + nodeID);
        }
        
        //TODO remove style
        
        delete this.channels[c.id()];
        c.destroy();
        
        this.layout();
        
        ui.removeChannel(c);
    };
    
    s.commit = function() {
        for (i in this.channels) {
            var c = this.channels[i];
            c.commit();
        }
    };

    function zoomTo(ele) {
        var pos;
        if (!ele || !ele.position)
            pos = { x: 0, y: 0 };        
        else 
            pos = ele.position();


        s.animate({
          fit: {
            eles: ele,
            padding: 50
          }
        }, {
            duration: 384
        });
    }
        
    return s;
};
