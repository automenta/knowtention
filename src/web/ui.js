/** this is the system of menus and views in which Spacegraph(s) can be viewed and controlled */
/*function Spacegrapher(e) {
 
 e.find('#AddMenu li a').click(function() {
 var t = $(this).text();
 notify(t);
 });
 
 $('#nodefocus').hide();
 }*/

function UI(e) {
    var u = {
    };

    initFrameDrag();

    var newContentTypes = ['text', 'data', 'map', 'timeline', 'sketch', 'www'];



    u.addChannel = function (space, c) {
        var cclass = c.id() + '_menu';
        e.find('.' + cclass).remove();



        var button = $('<a href="#">' + c.id() + '</a>');
        var dropdown = $('<ul id="drop_' + c.id() + '" class="dropdown"></ul>');


        for (var i = 0; i < newContentTypes.length; i++) {
            var t = newContentTypes[i];

            var l = $('<li></li>').append(a);
            var a, v;
            dropdown.append(l);

            if (t === 'www') {
                v = $('<input style="margin: 4px; width:85%" type="text" placeholder="http://"></input>');
                a = $('<button style="float: right">www</button>').data('type', t);

                l.append(v, a);
            }
            else {
                a = $('<a href="#">' + t + '</a>').data('type', t).appendTo(l);
            }

            a.click(function () {

                var type = $(this).data('type');
                notify('Adding new ' + type);

                var n = null;
                if (type === 'text') {
                    n = {
                        id: 'txt' + parseInt(Math.random() * 1000),
                        style: {
                            width: 32,
                            height: 32
                        },
                        widget: {
                            html: "<div contenteditable='true' class='editable' style='overflow: auto; resizable: both'></div>",
                            scale: 0.9,
                            style: {width: '300px', height: '300px'},
                            padding: 0
                        }
                    };
                }
                else if (type === 'www') {
                    var uurrll = v.val();
                    if (!uurrll.indexOf('http://') === 0)
                        uurrll = 'http://' + uurrll;

                    n = {
                        id: 'www' + parseInt(Math.random() * 1000),
                        style: {
                            width: 64,
                            height: 64
                        },
                        widget: {
                            html: '<iframe width="600px" height="600px" src="' + uurrll + '"></iframe>',
                            scale: 0.9,
                            style: {width: '600px', height: '600px'},
                            padding: 0
                        }
                    };
                }

                //            

                if (n) {

                    var ex = space.extent();
                    var cx = 0.5 * (ex.x1 + ex.x2);
                    var cy = 0.5 * (ex.y1 + ex.y2);

                    c.data.nodes.push(n);

                    space.updateChannel(c); //actually an update

                    space.getElementById(n.id).position({x: cx, y: cy});

                    c.commit();

                }

            });
        }

        e.find('#ChannelMenu').append(
                $('<li class="has-dropdown not-click"></li>').
                append(button, dropdown).addClass(cclass)
                ).foundation();


        /*
         <a href="#" class="button" data-dropdown="drop">Link Dropdown &raquo;</a>
         <ul id="drop" class="[tiny small medium large content]f-dropdown" data-dropdown-content>
         <li><a href="#">This is a link</a></li>
         <li><a href="#">This is another</a></li>
         <li><a href="#">Yet another</a></li>
         </ul> */


    };


    u.removeChannel = function (c) {

    };

    return u;
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

                node.position({ x: x, y: y });
                node.css({
                        'width': w,
                        'height': h
                });

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

