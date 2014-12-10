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
    
    $('#ChannelMenu').append($('<a href="#">F</a>').click(function() {
        s.setLayout({
           name: 'cose' 
        });
    }));
    $('#ChannelMenu').append($('<a href="#">G</a>').click(function() {
        s.setLayout({
           name: 'grid' 
        });
    }));
    $('#ChannelMenu').append($('<a href="#">C</a>').click(function() {
        s.setLayout({
           name: 'concentric' 
        });
    }));
    $('#ChannelMenu').append($('<a href="#">T</a>').click(function() {
        s.setLayout({
           name: 'breadthfirst' 
        });
    }));
    $('#ChannelMenu').append($('<a href="#">R</a>').click(function() {
        s.setLayout({
           name: 'random' 
        });
    }));

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
                            scale: 1.0,
                            style: {width: '600px', height: '600px'},
                            padding: 0.1
                        }
                    };
                }

                //            

                if (n) {

                    var ex = space.extent();
                    var cx = 0.5 * (ex.x1 + ex.x2);
                    var cy = 0.5 * (ex.y1 + ex.y2);

                    c.addNode(n);

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
