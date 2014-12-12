var person = {
    firstname: 'First',
    surname: 'Last',
    age: 0,

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
                'shape': 'rectangle'
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
                }
            },
            
            {id: 'p', 
                style: { 
                    shape: 'rectangle',
                    height: 60,
                    width: 30
                }
            },
            
            /*{id: 'b1', parent: 'p',
                style: { _content: 'x', shape: 'triangle', height: 4, width: 4 }
            },*/
            /*{id: 'b2', parent: 'p',
                style: { _content: 'y', shape: 'triangle', width: 8, height: 8 }
            },
            {id: 'b3', parent: 'p',
                style: { _content: 'z', shape: 'triangle', width: 8, height: 8 }
            },
            */
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
                        firstname: 'First',
                        surname: 'Last',
                        age: 0
                    },
                    style: {width: '300px', height: '260px'},
                    scale: 1
                },
                widget: {
                    html: '<x-metawidget id="metawidget1" path="person"></x-metawidget>',
                    style: {},
                    //html: '<iframe width="600px" height="600px" src="http://enenews.com"></iframe><br/><button>x</button>',
                    scale: 1,
                    pixelScale: 300.0,
                    minPixels: 2,
                },
                style: {
                    height: "24",
                    width: "24",
                    opacity: 0.75
                }
            },
            {id: 'u', 
                width: 48, height: 32, url: 'http://_wikipedia.org' },
            {id: 'e',
                width: 64,
                height: 64,
                widget: {
                    html: '<div style="width: 100%; height: 100%; background-color: orange; border: 2px solid black;"><div contenteditable="true" class="editable">WTF</div><br/><button>OK</button></div>',
                    style: {  },
                    scale: 0.9,
                    minPixels: 8,
                }
            },
            {id: 'e1',
                width: 64,
                height: 64,
                widget: {
                    html: '<div style="background-color: green; border: 2px solid black;"><div contenteditable="true" class="editable">OR(AND(F,B),Z) => X</div><br/><button>OK</button></div>',
                    style: {},
                    scale: 0.9,
                    minPixels: 16,
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
            {id: 'db', source: 'd', target: 'b'},
            //{id: 'b1b2', source: 'b1', target: 'b2'},
            //{id: 'b1b3', source: 'b1', target: 'b3'}
            //{id: 'eb', source: 'e', target: 'b'}
        ]
    };
}
