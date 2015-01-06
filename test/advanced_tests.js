var leptons;
Tinytest.addAsync('quark with leptons (depends on other quarks): waiting', function(test, complete) {
    var cubism = fermions.leptons();
    cubism.addToFn("default", function() {
        $("body").append("<div id='archy'/>");
    });
    leptons = fermions.leptons("test2");
    leptons.addToFn("default", function() {
        test.fail();
    });
    Template.depend = new Blaze.Template("Template.depend", function() {});
    Template.quark = new Blaze.Template("Template.quark", function() {});
    var quark = fermions.quark("quark", [cubism, "test2"]);
    var depend = fermions.quark("depend");
    quark.quarksToDependOn = ["depend"];
    Blaze.render(Template.quark, $("body")[0]);
    setTimeout(function() {
        complete();
    }, 1000);

});

Tinytest.addAsync('quark with leptons (depends on other quarks): loaded', function(test, complete) {
    leptons.reset();
    leptons.addToFn("default", function() {
        test.ok();
        complete();
    });
    Blaze.render(Template.depend, $("body")[0]);
});