function NodeFrame(spacegraph) {

    var f = {
        hoverUpdate: function() { /* implemented below */},
        hovered: null
    };
    
    $.get('frame.html', function(x) {               
       
        $('#widgets').append( x );

        var frame = $('#nodeframe');
        f.hovered = null;
        var frameVisible = false;
        var frameTimeToFade = 2000; //ms
        var frameHiding = -1;
        var frameNodeScale = 1;
        var frameNodeMargin = -0.25;

        initFrameDrag();


        //http://threedubmedia.com/code/event/drag/demo/resize2

        spacegraph.on('pan zoom', function(e) {
            setTimeout(hoverUpdate, 0);
        });

        spacegraph.on('mouseover mouseout mousemove', function(e) {

            var target = e.cyTarget;
            var over = (e.type !== "mouseout");

            if (frame.data('resizing'))
                over = true;                

            if (target && target.isNode && target.isNode()) {                
                if (over || (f.hovered!==target)) {
                    //cancel any hide fade
                    clearTimeout(frameHiding);
                    frameHiding = -1;
                }

                if (f.hovered!==target) {
                    frame.hide();
                    frameVisible = true;
                    frame.fadeIn();
                    f.hovered = target;
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
                                f.hovered = null;
                                frame.data('node', null);
                                frameHiding = -1;
                            });

                    }, frameTimeToFade);                
                }
            }
            
            if (currentlyVisible && f.hovered) {
                spacegraph.positionNodeHTML(f.hovered, frame, frameNodeScale, frameNodeMargin);
                frame.data('node', f.hovered);
            }

        }

        // ----------------------

        spacegraph.on('cxttapstart', function(e) {
            var target = e.cyTarget;

            if (!target) {                
                spacegraph.zoomTo();
            }
            else {
                spacegraph.zoomTo(target);
            }
        });


    });
    
    return f;
}

function initFrameDrag() {
    var nodeFrame = $('#nodeframe');
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
                var node = nodeFrame.data('node');
                
                nodeFrame.data('resizing', true);
                
                var pos = node.position();
                this.originalNode = node;
                this.originalPos = [ parseFloat(pos.x), parseFloat(pos.y) ];
                this.originalSize = [ node.width(), node.height(), node.renderedWidth(), node.renderedHeight() ];
                this.originalOffset = [ ui.offset.left, ui.offset.top ];
            },
            drag: function (event, ui) {

                var node = nodeFrame.data('node');
                if (node!=this.originalNode)
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
                
                /*
                node.animate({
                    position: { x: x, y: y },
                    css: { 
                        'width': w,
                        'height': h
                    }
                }, {
                    duration: 0
                });
                */


                /*setTimeout(function() {
                    
                    console.log(node);
                    
                    
                }, 0);*/
            
            },
            stop: function (event, ui) {
                
                nodeFrame.data('resizing', false);
            }

        });
    });
    /*
     
     se.pep({
     shouldEase: false,
     revert: true,
     revertAfter: 'stop',
     start: function() {
     console.log(se);
     notify('drag start: ' + JSON.stringify( se.position() ) );
     },
     stop: function() {
     notify('drag stop: ' + JSON.stringify( se.position() ) );
     
     
     
     
     se.css({
     bottom: '-0px',
     right: '-0px',               
     'margin': '0px',
     'top': '',
     'left': '',
     '-webkit-transform': '',
     'transform': ''
     });
     }
     });
     */
}

