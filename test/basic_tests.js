Tinytest.add('init', function (test) {  
    fermions("default");
});

Tinytest.addAsync('independent quark with leptons', function (test,complete) {  
    var cubism = fermions.leptons();
    cubism.addToFn("default",function(){
        $("body").append("<div id='archy'/>");
    });
    var leptons = fermions.leptons("test");
    leptons.addToFn("default",function(){
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
