#What is TBulter

TBulter (aka Template Bulter) is a library for writing reusable client-side JS for Templates on Meteor. It is designed for apps with sophisticated DOM view logic.

#QuickStart
Add TBulter to your Meteor project
```bash
meteor add arch:template-bulter
```


#Basic Usage


```javascript
TBulter.makeLogic("codeblock1", function(){
    //some code here
});
TBulter.makeLogic("codeblock2", function(){
    //some code here
});
TBulter.bond("TemplateName",["codeblock1","codeblock2"]); 
```

This would call `codeblock1` and `codeblock2` when `Template.TemplateName` is rendered.

You can also pass the object as parameter without giving it a string identifier.
```javascript
var electron = TBulter.makeLogic(function(){
    //some code here
});
TBulter.bond("TemplateName",[electron]); 
```

#Dependency
```javascript
TBulter.makeLogic("electron", function(){
    //some schrodinger's cat here
});
TBulter.makeLogic("muon", function(){
    //some schrodinger's cat here
});
TBulter.makeLogic("tau", function(){
    //some schrodinger's cat here
});

TBulter.bond("downQuark",["electron"]);
TBulter.bond("upQuark",["muon"]).depends(["downQuark"]); //name of the bond(s) to depend on
TBulter.bond("upQuark",["tau"]);
```
After `Template.upQuark` is rendered, `muon` would not be called until `Template.downQuark` is rendered. However, `tau` would be called immediately after `Template.upQuark` is rendered because it does not depend on anything.


Note: Unless an object `{TemplateName:"bondName"}` is passed as the 1st arguement, a bond would have the same name as the Template.

```javascript
TBulter.bond({TemplateName:"bondName"},["codeblock1","codeblock2"]);
TBulter.bond("upQuark",["muon"]).depends(["bondName"]);
```

#Setting variables when Template.created
```javascript
TBulter.makeLogic("electron", function(){
    console.log(TBulter.waveFunction /* this is just a variable*/);
});
TBulter.bond("downQuark",["electron"],{waveFunction:"collapsed"});
TBulter.bond("upQuark",["electron"],{waveFunction:"psi"});
```
This would log "collapsed" after `Template.downQuark` is rendered, and "psi" after `Template.upQuark` is rendered.

#On Template.destroyed

```javascript
TBulter.makeLogic("neutrino", function(){
    //code here would be called on Template.rendered
},function(){
   //code here would be called on Template.destroyed
});
TBulter.bond("charmQuark",["neutrino"]); 
```

The 2nd function that is passed into the `.makeLogic` would be called on `Template.destroyed`.

This is another way of doing it:

```javascript
TBulter.bond("charmQuark",[TBulter.makeLogic(function(){
    //code here would be called on Template.rendered
},function(){
   //code here would be called on Template.destroyed
})]); 
```

#Mobile view

```javascript
TBulter.mobileView(700); //this would assume that it is a mobile device if the window's width is smaller than 700px
TBulter.makeLogic("neutrino", function(){
    //called no matter if it is a mobile device or not
}).addToFn("mobile",function(){
   //called if it is a morible device
}).addToFn("default",function(){
  //called if it is not a mobile device
});
TBulter.bond("topQuark",["neutrino"]); 
```

If `TBulter.mobileView(max_width)` is not called, the function in `addToFn("default",function)` would always be called. 

You can always append more code into the makeLogic by using `.addToFn`.

#Cleaning up the function(s) in a makeLogic
```javascript
electron.reset() //reset both default and mobile
electron.reset("mobile") //only reset mobile
```

#License

"THE BEER-WARE LICENSE" (Revision 42):

As long as you retain this notice you can do whatever you want with this stuff. If we meet some day, and you think this stuff is worth it, you can buy me a beer in return