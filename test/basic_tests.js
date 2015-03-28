Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = TButler.code();
    cubism.addToFn("default",function(){
        console.log(this);
        $("body").append("<div id='archy'/>");
    });
    var lepton = TButler.code("test");
    lepton.addToFn("default",function(){
        if($("#archy")[0]!== undefined){
            complete();
        }else{
            test.fail();
        }
    });
    Template.spaceTime = new Blaze.Template("Template.spaceTime",function(){});
    var spaceTime = TButler.process("spaceTime",[cubism,"test"]); 
    Blaze.render(Template.spaceTime,$("body")[0]);
});

Tinytest.add('Setting variables when Template.created', function(test) {
    Template.a = new Blaze.Template("Template.a", function() {});
    TButler.code("x",function(){});
    TButler.process("a", ["x"],{hey:"yo"});
    Blaze.render(Template.a, $("body")[0]);
    test.equal(TButler.env.hey,"yo");
});


Tinytest.addAsync('Mobile view',function(test,complete){
    Template.a = new Blaze.Template("Template.a", function() {});
    TButler.mobileView(9999);
    TButler.code("po",function(){
        test.ok();
    }).addToFn("mobile",function(){
        test.ok();
        TButler.mobileView(10);
        complete();
    }).addToFn("default",function(){
        test.fail();
        complete();
    });
    TButler.process("a", ["po"]);
    Blaze.render(Template.a, $("body")[0]);
});
