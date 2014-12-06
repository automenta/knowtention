function newExampleChannel1() {
return {
id: 'defaultClient' + parseInt(Math.random() * 10000),
        style: [
        {
        selector: 'node',
                css: {
                'content': 'data(name)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'width': 'data(width)',
                        'height': 'data(height)'
                }
        },
        {
        selector: '$node > node',
                css: {
                'padding-top': '2px',
                        'padding-left': '2px',
                        'padding-bottom': '2px',
                        'padding-right': '2px',
                        'text-valign': 'top',
                        'text-halign': 'center'
                }
        },
        {
        selector: 'edge',
                css: {
                'target-arrow-shape': 'triangle'
                }
        },
        {
        selector: ':selected',
                css: {
                //'background-color': 'black',
                'line-color': 'black',
                        'target-arrow-color': 'black',
                        'source-arrow-color': 'black'
                }
        }
        ],
        elements: {
        nodes: [
        {data: {id: 'a', parent: 'b'}},
        {data: {id: 'b'}},
        {data: {id: 'c', parent: 'b'}},
        {data: {id: 'd',
                height: 128,
                width: 128,
                widget: {
                html: '<x-metawidget id="metawidget" path="person"></x-metawidget>',
                        //html: '<iframe width="600px" height="600px" src="http://enenews.com"></iframe><br/><button>x</button>',
                        scale: 1 / 600.0,
                        minPixels: 2,
                        padding: 0.1
                }
        }},
        {data: {id: 'e',
                widget: {
                html: '<div style="background-color: orange; border: 2px solid black;"><div contenteditable="true" class="editable">WTF</div><br/><button>OK</button></div>',
                        style: {width: '300px', height: '260px'},
                        scale: 1 / 300.0,
                        minPixels: 32,
                        padding: 0.25
                }
        }},
        {data: {id: 'e1',
                width: 64,
                height: 64,
                widget: {
                html: '<div style="background-color: green; border: 2px solid black;"><div contenteditable="true" class="editable">OR(AND(F,B),Z) => X</div><br/><button>OK</button></div>',
                        style: {width: '300px', height: '260px'},
                        scale: 1 / 300.0,
                        minPixels: 32,
                        padding: 0.25
                }
        }},
        {data: {id: 'f', parent: 'e'}}
        ],
                edges: [
                {data: {id: 'ad', source: 'a', target: 'd'}},
                {data: {id: 'eb', source: 'e', target: 'b'}}

                ]
        }
    };
}
