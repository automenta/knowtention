var person = {
    firstname: 'Jane',
    surname: 'Doe',
    age: 32,

    save: function (e) {
        document.getElementById('metawidget1').save();
        notify('Saved: ' + JSON.stringify(person));
    }
};

function newExampleChannel1() {


    return {
        id: 'untitled_' + parseInt(Math.random() * 100),
        style: {
            'node': {
                'content': 'data(content)',
                'text-valign': 'center',
                'text-halign': 'center',
                //'width': 'data(width)',
                //'height': 'data(height)',
                'shape': 'hexagon'
            },
            '$node > node': {
                'padding-top': '2px',
                'padding-left': '2px',
                'padding-bottom': '2px',
                'padding-right': '2px',
                'text-valign': 'top',
                'text-halign': 'center'
            },
            'edge': {
                'target-arrow-shape': 'triangle',
                //'line-style': 'dashed',
                'line-width': '16'
            },
            ':selected': {
                //'background-color': 'black',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black'
            }
        },
        nodes: [
            {id: 'b', 
                style: { 
                    shape: 'triangle',
                    height: 24,
                    width: 16                
                }, 
            },
            /*{id: 'a', parent: 'b',
                style: { content: '.', shape: 'triangle', width: '8', height: '8' }
            },
            {id: 'c', parent: 'b',
                style: { content: '.', shape: 'triangle', width: '8', height: '8' }
            },*/
            /*{
                    id: 'serial' + parseInt(Math.random()*100),
                    width: 16,
                    height: 16,
                        
                        widget: {
                            html: "<div contenteditable='true' class='editable' style='overflow: auto; resizable: both'></div>",
                            scale: 0.8,
                            style: {width: '300px', height: '300px'},
                        },
                },*/
            {id: 'd',
                form: {
                    value: {
                        firstname: 'Jane',
                        surname: 'Doe',
                        age: 32
                    },
                    style: {width: '300px', height: '260px'},
                    scale: 1
                },
                widget: {
                    html: '<x-metawidget id="metawidget1" path="person"></x-metawidget>',
                    style: {width: '300px', height: '260px'},
                    //html: '<iframe width="600px" height="600px" src="http://enenews.com"></iframe><br/><button>x</button>',
                    scale: 1,
                    minPixels: 2,
                    padding: 0.1
                },
                style: {
                    height: "24",
                    width: "24",
                    opacity: 0.75
                }
            },
            {id: 'e',
                width: 64,
                height: 64,
                widget: {
                    html: '<div style="background-color: orange; border: 2px solid black;"><div contenteditable="true" class="editable">WTF</div><br/><button>OK</button></div>',
                    style: {width: '300px', height: '260px'},
                    scale: 1.0,
                    minPixels: 32,
                    padding: 0.25
                }
            },
            {id: 'e1',
                width: 64,
                height: 64,
                widget: {
                    html: '<div style="background-color: green; border: 2px solid black;"><div contenteditable="true" class="editable">OR(AND(F,B),Z) => X</div><br/><button>OK</button></div>',
                    style: {width: '300px', height: '260px'},
                    scale: 1,
                    minPixels: 32,
                    padding: 0.25
                }
            }
            //{id: 'f', parent: 'e'}
        ],
        edges: [
            {id: 'eb', source: 'e', target: 'b',
                style: {
                    'line-color': 'blue',
                    'line-width': '44'
                }
            },
            {id: 'db', source: 'd', target: 'b'}
            //{id: 'eb', source: 'e', target: 'b'}
        ]
    };
}
