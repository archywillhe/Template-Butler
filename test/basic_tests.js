Tinytest.add('init', function (test) {  
    fermions("default");
});

Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = fermions.lepton();
    cubism.addToFn("default",function(){
        $("body").append("<div id='archy'/>");
    });
    var lepton = fermions.lepton("test");
    lepton.addToFn("default",function(){
        if($("#archy")[0]!== undefined){
            complete();
        }else{
            test.fail();
        }
    });
    Template.spaceTime = new Blaze.Template("Template.spaceTime",function(){});
    var spaceTime = fermions.quark("spaceTime",[cubism,"test"]); 
    Blaze.render(Template.spaceTime,$("body")[0]);
});

Tinytest.add('Setting variables when Template.created', function(test) {
    Template.a = new Blaze.Template("Template.a", function() {});
    fermions.lepton("x",function(){});
    fermions.quark("a", ["x"],{hey:"yo"});
    Blaze.render(Template.a, $("body")[0]);
    test.equal(fermions.env.hey,"yo");
});


Tinytest.addAsync('Mobile view',function(test,complete){
    Template.a = new Blaze.Template("Template.a", function() {});
    fermions.mobileView(9999);
    fermions.lepton("po",function(){
        test.ok();
    }).addToFn("mobile",function(){
        test.ok();
        fermions.mobileView(10);
        complete();
    }).addToFn("default",function(){
        test.fail();
        complete();
    });
    fermions.quark("a", ["po"]);
    Blaze.render(Template.a, $("body")[0]);
});
