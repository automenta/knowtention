function spacegraph(ui, target, opt) {
    
    var commitPeriodMS = 500;
    var suppressCommit = false;
    
    var ready = function() {

        var that = this;
        
        opt.start(this);
                

        //http://js.cytoscape.org/#events/collection-events
        //
        this.on('data position select unselect add remove grab drag style', function (e) {
            
            if (suppressCommit)
                return;
            
            /*console.log( evt.data.foo ); // 'bar'
             
             var node = evt.cyTarget;
             console.log( 'tapped ' + node.id() );*/

            var target = e.cyTarget;
            if (target) {
                if (widget(target))
                    queueWidgetUpdate(target);
                
                    
                //console.log(this, that, target);
                that.commit();
            }
            
        });
        

        //overlay framenode --------------        
        var frame = NodeFrame(this);
        
        
        

        
        // ------------------------
        
        // zoom handler

        var widgetsToUpdate = {};

        var baseRedraw = this._private.renderer.redraw;
        this._private.renderer.redraw = function(options) {
            baseRedraw.apply(this, arguments);

            frame.hoverUpdate();
            updateWidgets();
        };

        var baseDrawNode = this._private.renderer.drawNode;
        this._private.renderer.drawNode = function (context, node, drawOverlayInstead) {
            baseDrawNode.apply(this, arguments);

            if (widget(node)) {
                queueWidgetUpdate(node);
                if (frame.hovered === node)
                    setTimeout(frame.hoverUpdate, 0);
            }
        };

        function widget(node) {
            return node.data().widget;
        }

        function queueWidgetUpdate(node) {
            widgetsToUpdate[node.id()] = node;
        }

        var that = this;
        var updateWidgets = _.throttle(function () {

            var nextWidgetsToUpdate = _.values(widgetsToUpdate);

            if (nextWidgetsToUpdate.length > 0) {

                setTimeout(function () {
                    widgetsToUpdate = {};

                    for (var i = 0; i < nextWidgetsToUpdate.length; i++) {
                        var node = nextWidgetsToUpdate[i];
                        that.updateNodeWidget(node);
                    }

                }, 0);
            }

        }, 10);

        

        

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
        initrender: function (evt) { /* ... */ },
        //renderer: { /* ... */},
        container: target[0]
    });
    
    
    var s = cytoscape(opt);
    
    
    // EdgeHandler: the default values of each option are outlined below:
    var ehDefaults  = {
      preview: true, // whether to show added edges preview before releasing selection
      handleSize: 3, // the size of the edge handle put on nodes
      handleColor: "rgba(255, 0, 0, 0.5)", // the colour of the handle and the line drawn from it
      handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
      handleLineWidth: 1, // width of handle line in pixels
      handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
      hoverDelay: 150, // time spend over a target node before it is considered a target selection
      cxt: true, // whether cxt events trigger edgehandles (useful on touch)
      enabled: true, // whether to start the plugin in the enabled state
      toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
      edgeType: function( sourceNode, targetNode ){
        // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
        // returning null/undefined means an edge can't be added between the two nodes
        return 'flat'; 
      },
      loopAllowed: function( node ){
        // for the specified node, return whether edges from itself to itself are allowed
        return false;
      },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      nodeParams: function( sourceNode, targetNode ){
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for intermediary node
        return {};
      },
      edgeParams: function( sourceNode, targetNode, i ){
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        // NB: i indicates edge index in case of edgeType: 'node'
        return {};
      },
      start: function( sourceNode ){
        // fired when edgehandles interaction starts (drag on handle)
      },
      complete: function( sourceNode, targetNodes, addedEntities ){
        // fired when edgehandles is done and entities are added
      },
      stop: function( sourceNode ){
        // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
      }
    };

    s.edgehandles( ehDefaults );    
    
    
    
    
    
    s.channels = { };
    s.widgets = new WeakMap(); //node -> widget
    s.currentLayout = {
        name: 'cose'
    };
    
    function wrapInData(d) {
        var w = { data: d };
        if (d.style)
            w.css = d.style;
        if (!d.style) {
            d.style = w.css = { width: 16, height: 16 };
            /*if (!w.css) w.css = { };
            w.css.width = "16px";
            w.css.height = "16px";*/
        }
        
        return w;
    }

    s.updateNodeWidget = function(node) {
        var widget = node.data().widget; //html string
        var w = this.widgets.get(node);

        function setWidgetHTML() {
            w.html(widget.html).data('when', Date.now());
        }

        /*if (w) {
         var whenLastModified = w.data('when');
         if (whenLastModified < Date.now()) {

         }
         }*/

        var that = this;
        
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

            this.widgets.set(node, w);
        }

        this.positionNodeHTML(node, w, widget.scale, widget.padding, widget.minPixels);

    };

    
    /** html=html dom element */
    s.positionNodeHTML = function(node, html, scale, padding, minPixels) {
        
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
        
        var aspectRatio = false;
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
    };
    
    s.updateChannel = function(c) {
        
        
        //TODO assign channel reference to each edge as done above with nodes
        
        var e = {
            nodes: c.data.nodes ? c.data.nodes.map(wrapInData) : [], // c.data.nodes,
            edges: c.data.edges ? c.data.edges.map(wrapInData) : [] //c.data.edges
        };        
            
        var that = this;
        this.batch(function() {

            suppressCommit = true;
            
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

                    that.style().clear();        

                    that.style().fromJson(s);
                    that.style().update();
                }
            }

/*
            for (var i = 0; i < e.nodes.length; i++) {
                var n = e.nodes[i];
                if (n.data && n.data.id)
                    that.remove('#' + n.data.id);
            }
            */

            that.add( e );

            //add position if none exist
            for (var i = 0; i < e.nodes.length; i++) {
                var n = e.nodes[i];
                if (n.data && n.data.id) {
                    var nn = that.nodes('#' + n.data.id);
                    var ep = nn.position();
                    if (!ep || !ep.x)
                        nn.position({ x: 0, y: 0 });
                }                    
            }
            

            that.resize();

            suppressCommit = false;
            
        });
        
    };
    
    /** set and force layout update */
    s.setLayout = function(l){

        this.currentLayout = l;
        delete this.currentLayout.eles;
        
        //http://js.cytoscape.org/#layouts
        /*var layout = this.makeLayout(this.currentLayout);
        layout.run();            */
        this.layout(this.currentLayout);
    };
    
    s.addChannel = function(c) {
        
        //var nodesBefore = this.nodes().size();
        
        this.channels[c.id()] = c;
        
        if (c.ui!==this)
            c.init(this);
      
        this.updateChannel(c);
       
        //if (nodesBefore < this.nodes().size()) {
            this.setLayout(s.currentLayout);        
        //}        

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
    
    s.commit = _.throttle(function() {
        for (i in this.channels) {
            var c = this.channels[i];
            c.commit();
        }
    }, commitPeriodMS);

    s.zoomTo = function(ele) {
        var pos;
        if (!ele || !ele.position)
            pos = { x: 0, y: 0 };        
        else 
            pos = ele.position();


        s.animate({
          fit: {
            eles: ele,
            padding: 80
          }
        }, {
            duration: 384
        });
    };
        
    return s;
};
