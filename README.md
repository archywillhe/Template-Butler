#What is Fermions

Fermions is a library for writing reusable client-side JS for Templates on Meteor.

#QuickStart
Add the Fermions pacakge it to your Meteor project
```bash
meteor add arch:fermions
```

#Basic Usage

```javascript
Fermions.lepton("codeblock1", function(){
    //some code here
});
Fermions.lepton("codeblock2", function(){
    //some code here
});
Fermions.quark("TemplateName",["codeblock1","codeblock2"]); 
```

It would call `codeblock1` and `codeblock2` when `Template.TemplateName` is rendered.

You can also pass the entire object as parameter without giving it a string identifier.
```javascript
var electron = Fermions.lepton(function(){
    //some code here
});
Fermions.quark("TemplateName",[electron]); 
```

#Dependency
```javascript
Fermions.lepton("electron", function(){
    //some schrodinger's cat here
});
Fermions.lepton("muon", function(){
    //some schrodinger's cat here
});
Fermions.lepton("tau", function(){
    //some schrodinger's cat here
});

Fermions.quark("downQuark",["electron"]);
Fermions.quark("upQuark",["muon"]).depends(["downQuark"]); //name of the quark(s) to depend on
Fermions.quark("upQuark",["tau"]);
```
After `upQuark` is rendered, `muon` would not be called until `Template.downQuark` is rendered. However, `tau` would be called because it does not depend on anything.


Note: Unless an object `{TemplateName:"quarkName"}` is passed as the 1st arguement, a quark would have the same name as the Template.

```javascript
Fermions.quark({TemplateName:"quarkName"},["codeblock1","codeblock2"]);
Fermions.quark("upQuark",["muon"]).depends(["quarkName"]);
```


#Setting variables when Template.created
```javascript
Fermions.lepton("electron", function(){
    console.log(Fermions.waveFunction /* this is just a variable*/);
});
Fermions.quark("downQuark",["electron"],{waveFunction:"collapsed"});
Fermions.quark("upQuark",["electron"],{waveFunction:"psi"});
```
This would log "collapsed" after `Template.downQuark` is rendered, and "psi" after `Template.upQuark` is rendered.

#On Template.destroyed

```javascript
Fermions.lepton("neutrino", function(){
    //code here would be called on Template.rendered
},function(){
   //code here would be called on Template.destroyed
});
Fermions.quark("charmQuark",["neutrino"]); 
```

The second function that is passed into the `.lepton` would be called on `Template.destroyed`. This is another way of doing it:

```javascript
Fermions.quark("charmQuark",[Fermions.lepton(function(){
    //code here would be called on Template.rendered
},function(){
   //code here would be called on Template.destroyed
})]); 
```

#Mobile view

```javascript
Fermions.mobileView(700); //this would assume that it is a mobile device if the window's width is smaller than 700px
Fermions.lepton("neutrino", function(){
    //code here would be called no matter if it is a mobile device or not
}).addToFn("mobile",function(){
   //code here would only be called if it is a morible device
}).addToFn("default",function(){
  //code here would only be called if it is not a mobile device
});
Fermions.quark("topQuark",["neutrino"]); 
```

If `Fermions.mobileView(max_width)` is not called, the function in `addToFn("default",function)` would always be called and `addToFn("mobile",function)` would never be called. 

You can always append more code into the function by using `.addToFn`.

#Cleaning up the function(s) in a lepton
```javascript
electron.reset() //reset both default and mobile
electron.reset("mobile") //only reset mobile
```

#License

"THE BEER-WARE LICENSE" (Revision 42):

As long as you retain this notice you can do whatever you want with this stuff. If we meet some day, and you think this stuff is worth it, you can buy me a beer in return