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

    var newContentTypes = ['text', 'data', 'website', 'map', 'timeline', 'sketch'];



    u.addChannel = function (space, c) {
        var cclass = c.id() + '_menu';
        e.find('.' + cclass).remove();



        var button = $('<a href="#">' + c.id() + '</a>');
        var dropdown = $('<ul class="dropdown"></ul>');

        for (var i = 0; i < newContentTypes.length; i++) {
            var t = newContentTypes[i];
            var a = $('<a href="#"> + ' + t + '</a>');
            a.data('type', t);
            a.click(function() {
               console.log('CLICKED'); 
               
                var type = $(this).data('type');
                notify('Adding new ' + type);

                var n = null;
                if (type === 'text') {
                    /*n = {
                     group: "nodes",
                     data: {
                     id: 'serial' + Math.random(),
                     widget: {
                     html: "<div contenteditable='true' class='editable' style='overflow: auto; resizable: both'></div>"
                     },
                     width: 16,
                     height: 16
                     },
                     position: { x: 100, y: 100 }
                     };*/
                    n = {
                        id: 'serial' + parseInt(Math.random() * 100),
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
            dropdown.append($('<li></li>').append(a));
        }


        $('#ChannelMenu').append( 
                $('<li class="has-dropdown"></li>').
                append(button, dropdown).
                addClass(cclass)
        );
    };


    u.removeChannel = function (c) {

    };

    return u;
}

function initFrameDrag() {
/*
    var se = $('#nodeframe #resizeSE');
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

