Tinytest.add('init', function (test) {  
    TBulter("default");
});

Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = TBulter.makeLogic();
    cubism.addToFn("default",function(){
        $("body").append("<div id='archy'/>");
    });
    var lepton = TBulter.makeLogic("test");
    lepton.addToFn("default",function(){
        if($("#archy")[0]!== undefined){
            complete();
        }else{
            test.fail();
        }
    });
    Template.spaceTime = new Blaze.Template("Template.spaceTime",function(){});
    var spaceTime = TBulter.bond("spaceTime",[cubism,"test"]); 
    Blaze.render(Template.spaceTime,$("body")[0]);
});

Tinytest.add('Setting variables when Template.created', function(test) {
    Template.a = new Blaze.Template("Template.a", function() {});
    TBulter.makeLogic("x",function(){});
    TBulter.bond("a", ["x"],{hey:"yo"});
    Blaze.render(Template.a, $("body")[0]);
    test.equal(TBulter.env.hey,"yo");
});


Tinytest.addAsync('Mobile view',function(test,complete){
    Template.a = new Blaze.Template("Template.a", function() {});
    TBulter.mobileView(9999);
    TBulter.makeLogic("po",function(){
        test.ok();
    }).addToFn("mobile",function(){
        test.ok();
        TBulter.mobileView(10);
        complete();
    }).addToFn("default",function(){
        test.fail();
        complete();
    });
    TBulter.bond("a", ["po"]);
    Blaze.render(Template.a, $("body")[0]);
});
