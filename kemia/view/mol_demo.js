goog.require('kemia.controller.ReactionEditor');
goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.debug.Console');
goog.require('kemia.io.mdl');
goog.require('goog.ui.Select');
goog.require('kemia.io.Testdata');

function draw() {
    // uncomment next two lines to debug to console
    //var c = new goog.debug.Console();
    //c.setCapturing(true);
    var sdfs = kemia.io.Testdata.sdf.split("$$$$\n");
    var mol_renderer = new kemia.controller.ReactionEditor(goog.dom.getElement('container'), {
        background: {
            color: 'white'
        }
    });

    var select1 = new goog.ui.Select();
    select1.addItem(new goog.ui.MenuItem('1', 1));
    select1.addItem(new goog.ui.MenuItem('2', 2));
    select1.addItem(new goog.ui.MenuItem('3 (bucky ball)', 3));
    select1.addItem(new goog.ui.MenuItem('4', 4));
    select1.addItem(new goog.ui.MenuItem('5', 5));
    select1.addItem(new goog.ui.MenuItem('6', 6));
    select1.addItem(new goog.ui.MenuItem('7', 7));
    select1.addItem(new goog.ui.MenuItem('8', 8));
    select1.addItem(new goog.ui.MenuItem('9', 9));
    select1.addItem(new goog.ui.MenuItem('10', 10));
    select1.addItem(new goog.ui.MenuItem('11 (too large right now)', 11));
    select1.addItem(new goog.ui.MenuItem('12', 12));
    select1.addItem(new goog.ui.MenuItem('13', 13));
    select1.addItem(new goog.ui.MenuItem('14', 14));
    select1.addItem(new goog.ui.MenuItem('15', 15));
    select1.addItem(new goog.ui.MenuItem('16', 16));
    select1.addItem(new goog.ui.MenuItem('17', 17));

    select1.setSelectedIndex(0);
    select1.render(goog.dom.getElement('selectMolecule'));


    goog.events.listen(select1, goog.ui.Component.EventType.ACTION,
    function(e) {
        var timer = goog.now();
        var select = e.target;
        var idx = select.getValue();
        var molfile = sdfs[idx];
        var mol = kemia.io.mdl.readMolfile(molfile);
        mol_renderer.setModels([mol]);
        goog.dom.setTextContent(goog.dom.getElement('perf'), (goog.now() - timer) + 'ms');
    });

}


goog.events.listen(window, goog.events.EventType.LOAD, draw);