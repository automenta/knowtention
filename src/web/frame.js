function NodeFrame(spacegraph) {

    var f = {
        hoverUpdate: function() { /* implemented below */},
        hide: function() { /* see below */ },
        hovered: null
    };
    
    $.get('frame.html', function(x) {               
       
        $('#widgets').append( x );

        var frameEle = $('#nodeframe');
        f.hovered = null;
        var frameVisible = false;
        var frameTimeToFade = 2000; //ms
        var frameHiding = -1;
        var frameNodePixelScale = 300;
        var frameNodeScale = 1.25;

        initFrameDrag(f);


        //http://threedubmedia.com/code/event/drag/demo/resize2

        spacegraph.on('pan zoom', function(e) {
            setTimeout(f.hoverUpdate, 0);
        });

        spacegraph.on('mouseover mouseout mousemove', function(e) {

            var target = e.cyTarget;
            var over = (e.type !== "mouseout");

            if (frameEle.data('resizing')) {
                target = frameEle.data('node');
                frameEle.show();
                over = true;    
            }

            if (target && target.isNode && target.isNode()) {                
                if (over || (f.hovered!==target)) {
                    //cancel any hide fade
                    clearTimeout(frameHiding);
                    frameHiding = -1;
                }

                if (f.hovered!==target) {
                    frameEle.hide();
                    frameVisible = true;
                    frameEle.fadeIn();
                    f.hovered = target;
                }
            } else {
                frameVisible = false;
            }

            setTimeout(f.hoverUpdate, 0);

        });

        f.hide = function() {
            frameVisible = false;
            this.hovered = null;
            this.hoverUpdate();   
            
            //TODO fadeOut almost works, but not completely. so hide() for now
            frameEle.hide();
        };

        f.hoverUpdate = function() {
            var currentlyVisible = frameEle.is(':visible');
                        
            if (frameVisible) {
                if (!currentlyVisible)
                    frameEle.fadeIn();
            }
            else {                
                if ((frameHiding===-1) && (currentlyVisible)) {
                    frameHiding = setTimeout(function() {
                        //if still set for hiding, actually hide it
                        if (!frameVisible)
                            frameEle.fadeOut(function() {
                                f.hovered = null;
                                frameEle.data('node', null);
                                frameHiding = -1;
                            });

                    }, frameTimeToFade);                
                }
            }
            
            if (currentlyVisible && f.hovered) {
                spacegraph.positionNodeHTML(f.hovered, frameEle, frameNodePixelScale, frameNodeScale);
                frameEle.data('node', f.hovered);
            }

        };



    });
    
    return f;
}

function initFrameDrag(nodeFrame) {
    var frameEle = $('#nodeframe');
    
    
    var close = $('#nodeframe #close');
    close.click(function() {
        var node = frameEle.data('node');        
        if (node) {
            var space = node.cy();
            
            space.removeNode(node);            
            
            frameEle.data('node', null);
            nodeFrame.hide();
        }
    });
    
    var se = $('#nodeframe #resizeSE');
    $(function () {
        //$( "#draggable" ).draggable({ revert: true });
        se.draggable({
            revert: true, 
            helper: "clone",
            appendTo: '#nodeframe #resizeSE',
            //appendTo: "body",
            
            //http://api.jqueryui.com/draggable/#event-drag
            start: function (event, ui) {
                var node = frameEle.data('node');
                
                if (!node)
                    return;
                
                var pos = node.position();
                if (!pos) {
                    console.error('node ', node, 'has no position');
                    return;
                }
                
                frameEle.data('resizing', true);
                                
                this.originalNode = node;
                this.originalPos = [ parseFloat(pos.x), parseFloat(pos.y) ];
                this.originalSize = [ node.width(), node.height(), node.renderedWidth(), node.renderedHeight() ];
                this.originalOffset = [ ui.offset.left, ui.offset.top ];
            },
            drag: function (event, ui) {

                var node = frameEle.data('node');
                if (node!==this.originalNode)
                    return;
            
                var dx = parseFloat(ui.offset.left - this.originalOffset[0]);
                var dy = parseFloat(ui.offset.top - this.originalOffset[1]);
                
                var p = this.originalPos;
                var os = this.originalSize;
                
                var dw = dx * (os[0]/os[2]);
                var dh = dy * (os[1]/os[3]);
                var w = os[0] + dw;
                var h = os[1] + dh;
                var x = p[0] + dw/2.0;
                var y = p[1] + dh/2.0;


                node.position({ x: x, y: y });
                node.css({
                        'width': w,
                        'height': h
                });               
            },
            stop: function (event, ui) {
                
                frameEle.data('resizing', false);
            }

        });
    });
}

