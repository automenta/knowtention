/** this is the system of menus and views in which Spacegraph(s) can be viewed and controlled */
function Spacegrapher(e) {

    e.find('#AddMenu li a').click(function() {
        var t = $(this).text();
        notify(t);
    });
    
    $('#nodefocus').hide();
}

function UI(e) {
    var u = {
        
    };
    
    var newContentTypes = [ 'text', 'nobject', 'website', 'map', 'timeline', 'sketch'];
    

    
    u.addChannel = function(space, c) {
        var cclass = c.id() + '_menu';
        e.find('.' + cclass).remove();
        
        var button = $('<a href="#">' + c.id() + '</a>').addClass('cclass');
        var dropdown = $('<ul id="AddMenu" class="dropdown">').addClass('cclass');

        function addHandler(e) {
            var type = $(this).data('type');
            notify('Adding new ' + type );

            var n = null;
            if (type === 'text') {
                n = {
                    group: "nodes",
                    data: {
                        id: 'serial' + Math.random(),
                        widget: {
                            html: "<div contenteditable='true' class='editable'></div>"
                        },
                        width: 16,
                        height: 16
                    },
                    position: { x: 100, y: 100 }
                };
            }
            if (n) {
                space.add(n);
                space.resize();
                space.layout();
                space.commit();
            }
            
        } 
        
        _.each(newContentTypes, function(t) {
            var a = $('<a href="#">+ ' + t + '</a>').data('type', t);
            a.click(addHandler);
            dropdown.append( $('<li/>').append(a) );
        });

       
       $('#ChannelMenu').append(button, dropdown);
    }
    
    
    u.removeChannel = function(c) {
        
    };
    
    return u;
}