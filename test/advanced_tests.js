var lepton;
Tinytest.addAsync('quark with leptons (depends on other quarks): waiting', function(test, complete) {
    var cubism = TButler.code();
    cubism.addToFn("default", function() {
        $("body").append("<div id='archy'/>");
    });
    lepton = TButler.code("test2");
    lepton.addToFn("default", function() {
        test.fail();
    });
    Template.depend = new Blaze.Template("Template.depend", function() {});
    Template.quark = new Blaze.Template("Template.quark", function() {});
    var quark = TButler.process("quark", [cubism, "test2"]);
    var depend = TButler.process("depend");
    quark.bondsToDependOn = ["depend"];
    Blaze.render(Template.quark, $("body")[0]);
    setTimeout(function() {
        complete();
    }, 1000);

});

Tinytest.addAsync('quark with leptons (depends on other quarks): loaded && reset', function(test, complete) {
    lepton.reset();
    /*this is to test TButler.reset*/
    lepton.addToFn("default",function(){
        test.fail();
    });
    TButler.reset("test2");
    /*TButler.reset test ends */
    lepton.addToFn("default", function() {
        test.ok();
        complete();
    });
    Blaze.render(Template.depend, $("body")[0]);
});

Tinytest.addAsync('On Template.destroyed', function(test, complete) {
    Template.q = new Blaze.Template("Template.q", function() {});
    var d, view;
    TButler.code("z",
        function() {
            d = 1;
            view = Blaze.currentView;
            console.log(this);
            Blaze.remove(view);
        },
        function() {
            test.equal(d, 1);
            console.log(this);
            complete();
        });
    TButler.process("q", ["z"]);
    Blaze.render(Template.q, $("body")[0]);
});
