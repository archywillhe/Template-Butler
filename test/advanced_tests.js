var lepton;
Tinytest.addAsync('quark with leptons (depends on other quarks): waiting', function(test, complete) {
    var cubism = Fermions.lepton();
    cubism.addToFn("default", function() {
        $("body").append("<div id='archy'/>");
    });
    lepton = Fermions.lepton("test2");
    lepton.addToFn("default", function() {
        test.fail();
    });
    Template.depend = new Blaze.Template("Template.depend", function() {});
    Template.quark = new Blaze.Template("Template.quark", function() {});
    var quark = Fermions.quark("quark", [cubism, "test2"]);
    var depend = Fermions.quark("depend");
    quark.quarksToDependOn = ["depend"];
    Blaze.render(Template.quark, $("body")[0]);
    setTimeout(function() {
        complete();
    }, 1000);

});

Tinytest.addAsync('quark with leptons (depends on other quarks): loaded', function(test, complete) {
    lepton.reset();
    lepton.addToFn("default", function() {
        test.ok();
        complete();
    });
    Blaze.render(Template.depend, $("body")[0]);
});

Tinytest.addAsync('On Template.destroyed', function(test, complete) {
    Template.q = new Blaze.Template("Template.q", function() {});
    var d, view;
    Fermions.lepton("z",
        function() {
            d = 1;
            view = Blaze.currentView;
            Blaze.remove(view);
        },
        function() {
            test.equal(d, 1);
            complete();
        });
    Fermions.quark("q", ["z"]);
    Blaze.render(Template.q, $("body")[0]);
});
