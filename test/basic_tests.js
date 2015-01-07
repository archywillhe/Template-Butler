Tinytest.add('init', function (test) {  
    Fermions("default");
});

Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = Fermions.lepton();
    cubism.addToFn("default",function(){
        $("body").append("<div id='archy'/>");
    });
    var lepton = Fermions.lepton("test");
    lepton.addToFn("default",function(){
        if($("#archy")[0]!== undefined){
            complete();
        }else{
            test.fail();
        }
    });
    Template.spaceTime = new Blaze.Template("Template.spaceTime",function(){});
    var spaceTime = Fermions.quark("spaceTime",[cubism,"test"]); 
    Blaze.render(Template.spaceTime,$("body")[0]);
});

Tinytest.add('Setting variables when Template.created', function(test) {
    Template.a = new Blaze.Template("Template.a", function() {});
    Fermions.lepton("x",function(){});
    Fermions.quark("a", ["x"],{hey:"yo"});
    Blaze.render(Template.a, $("body")[0]);
    test.equal(Fermions.env.hey,"yo");
});


Tinytest.addAsync('Mobile view',function(test,complete){
    Template.a = new Blaze.Template("Template.a", function() {});
    Fermions.mobileView(9999);
    Fermions.lepton("po",function(){
        test.ok();
    }).addToFn("mobile",function(){
        test.ok();
        Fermions.mobileView(10);
        complete();
    }).addToFn("default",function(){
        test.fail();
        complete();
    });
    Fermions.quark("a", ["po"]);
    Blaze.render(Template.a, $("body")[0]);
});
