## What is Template Butler ##

Template Butler (or TButler) is a library for writing reusable client-side JS for Templates on Meteor. It is designed for apps with sophisticated DOM view logic.

## QuickStart ##
Add Template Butler to your Meteor project
```bash
meteor add arch:template-butler
```


## Basic Usage ##

You can use either `TemplateButler` or `TButler`. They both refer to the same object.

```javascript
TButler.code("codeblock1", function(){
    //some code here
});
TButler.code("codeblock2", function(){
    //some code here
});
TButler.process("TemplateName",["codeblock1","codeblock2"]); 
```

This would call `codeblock1` and `codeblock2` when `Template.TemplateName` is rendered.

You can also pass the object as parameter without giving it a string identifier.
```javascript
var someVariable = TButler.code(function(){
    //some code here
});
TButler.process("TemplateName",[someVariable]); 
```

## Dependency ##
```javascript
TButler.code("a", function(){
    //some functions here
});
TButler.code("b", function(){
    //some functions here
});
TButler.code("x", function(){
    //some functions here
});

TButler.process("Archy",["a"]);
TButler.process("Cat",["b"]).depends(["Archy"]); //name of the process(s) to depend on
TButler.process("Cat",["x"]);
```
After `Template.Cat` is rendered, `b` would not be called until `Template.Archy` is rendered. However, `x` would be called immediately after `Template.Cat` is rendered because it does not depend on anything.


Note: Unless an object `{TemplateName:"processName"}` is passed as the 1st arguement, a process would have the same name as the Template.

```javascript
TButler.process({TemplateName:"processName"},["codeblock1","codeblock2"]);
TButler.process("Cat",["b"]).depends(["processName"]);
```

## Setting variables on Template.created ##
```javascript
TButler.code("a", function(){
    console.log(TButler.env.key);
});
TButler.process("Archy",["a"],{key:"value1"});
TButler.process("Cat",["a"],{key:"value2"});
```
This would log "value1" after `Template.Archy` is rendered, and "value2" after `Template.Cat` is rendered.

## On Template.destroyed ##

```javascript
TButler.code("c", function(){
    //functions here would be called on Template.rendered
},function(){
   //functions here would be called on Template.destroyed
});
TButler.process("_footer",["c"]); 
```

The 2nd function that is passed into the `.code` would be called on `Template.destroyed`.

This is another way of doing it:

```javascript
TButler.process("_footer",[TButler.code(function(){
    //code here would be called on Template.rendered
},function(){
   //code here would be called on Template.destroyed
})]); 
```

## Mobile view ##

```javascript
TButler.mobileView(700); //this would assume that it is a mobile device if the window's width is smaller than 700px
TButler.code("c", function(){
    //called no matter if it is a mobile device or not
}).addToFn("mobile",function(){
   //called if it is a morible device
}).addToFn("default",function(){
  //called if it is not a mobile device
});
TButler.process("appLayout",["c"]); 
```

If `TButler.mobileView(max_width)` is not called, the function in `addToFn("default",function)` would always be called. 

You can always append more code into the code by using `.addToFn`.

## Cleaning up the function(s) in a code block ##
```javascript
var a = TButler.code("codeblock1", function(){
});
a.reset() //reset both default and mobile
Bulter.reset('codeblock1'); //alternative
a.reset("mobile") //only reset mobile
```

## License ##

"THE BEER-WARE LICENSE" (Revision 42):

As long as you retain this notice you can do whatever you want with this stuff. If we meet some day, and you think this stuff is worth it, you can buy me a beer in return
