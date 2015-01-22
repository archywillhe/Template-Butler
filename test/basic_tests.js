Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = Butler.makeLogic();
    cubism.addToFn("default",function(){
        console.log(this);
        $("body").append("<div id='archy'/>");
    });
    var lepton = Butler.makeLogic("test");
    lepton.addToFn("default",function(){
        if($("#archy")[0]!== undefined){
            complete();
        }else{
            test.fail();
        }
    });
    Template.spaceTime = new Blaze.Template("Template.spaceTime",function(){});
    var spaceTime = Butler.bond("spaceTime",[cubism,"test"]); 
    Blaze.render(Template.spaceTime,$("body")[0]);
});

Tinytest.add('Setting variables when Template.created', function(test) {
    Template.a = new Blaze.Template("Template.a", function() {});
    Butler.makeLogic("x",function(){});
    Butler.bond("a", ["x"],{hey:"yo"});
    Blaze.render(Template.a, $("body")[0]);
    test.equal(Butler.env.hey,"yo");
});


Tinytest.addAsync('Mobile view',function(test,complete){
    Template.a = new Blaze.Template("Template.a", function() {});
    Butler.mobileView(9999);
    Butler.makeLogic("po",function(){
        test.ok();
    }).addToFn("mobile",function(){
        test.ok();
        Butler.mobileView(10);
        complete();
    }).addToFn("default",function(){
        test.fail();
        complete();
    });
    Butler.bond("a", ["po"]);
    Blaze.render(Template.a, $("body")[0]);
});
