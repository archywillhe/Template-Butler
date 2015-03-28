//Fun fact: ↂωↂ is initially known as "Fermions" (which doesn't matter now) and pauli exclusion principle states that fermions cannot share the same quantum states 
//Read more here http://en.wikipedia.org/wiki/Pauli_exclusion_principle

ↂωↂ  = function() {
    var deviceType = "default",
        //"码" means code in Chinese.
        //an alternative for the name is "codeBlock", which is pretty long in length
        //so I decided to use this Sinitic character to boost readability
        //nobody likes identifiers that are too long
        ↂ码sↂ = {},
        ↂbondsↂ = {};

    //Fun fact: bond is intially known as "quark" (which doesn't matter now)

    //bond is used to bind a template with code blocks (码s)
    function bond(templateName, 码, initSetting) {
        this.码 = 码 || [];
        try {
            var template = Template[templateName];
        } catch (e) {
            console.log("Hey man the Template " + templateName + " can't be found: a bond has not been successfully constructed :(");
        } finally {
            //3 states: create, render, destroy
            var previousFn;
            previousFn = template.created || function(){};
            template.created = function() {
                if (initSetting !== undefined) {
                    for(key in initSetting){
                        ↂωↂ.env[key] = initSetting[key];
                    }
                }
                previousFn();
            }
            previousFn = template.rendered || function(){};
            template.rendered = _.bind(function() {
                this.loaded = true;
                this.load码s(template);
                previousFn();
            }, this);
            previousFn = template.destroyed || function(){};
            template.destroyed = _.bind(function() {
                this.loaded = false;
                this.unload码s(template);
                previousFn();
            }, this);
        }
    }

    //default empty arrays/function to be over-written
    bond.prototype.bondsToDependOn = [];
    bond.prototype.Xtra码s = [];

    bond.prototype.depends = function(bonds) {
        this.bondsToDependOn = this.bondsToDependOn.concat(bonds);
    }

    bond.prototype.load码s = function(template) {
        var dependedLoaded = true,
            notloadedQuark,
            futureQuark;
        for (key in this.bondsToDependOn) {
            if (ↂbondsↂ[this.bondsToDependOn[key]].loaded !== true) {
                dependedLoaded = false;
                futureQuark = ↂbondsↂ[this.bondsToDependOn[key]];
                break;
            }
        }
        //nothing happens if there is no extra 码
        if (this.Xtra码s === []) {
            this.码s = this.码;
        } else {
            this.码s = this.码.concat(this.Xtra码s);
            //clean Xtra码s afterwards because extra 码 are added 
            //only when a bond's dependent bond is not loaded
            this.Xtra码s = [];
        }
        if (dependedLoaded === true) {
            for (key in this.码s) {
                if(typeof this.码s[key] === "string"){
                    ↂ码sↂ[this.码s[key]].runCode(template);
                }else{
                    ↂ码sↂ[this.码s[key].name].runCode(template);
                }
            }
        } else {
            futureQuark.Xtra码s = futureQuark.Xtra码s.concat(this.码s);
        }
    }

    bond.prototype.unload码s = function(template) {
        for (key in this.码s) {
           if(typeof this.码s[key] === "string"){
                ↂ码sↂ[this.码s[key]].runAntiCode(template);
            }else{
                ↂ码sↂ[this.码s[key].name].runAntiCode(template);
            }
        }
    }

    var initalState = function(template) {
    };

    //Fun fact: 码 is intially known as "lepton" (which doesn't matter now)

    //码 consists of 2 pieces of code:
    //1st piece runs when Template rendered.
    //2nd piece runs when Template destroyed.
    function 码() {
        this.firstLoaded = false;
    }

    码.prototype.runCode = function(template) {
        this.firstLoaded = true;
        this.loaded = true;
        //deviceType = "default" or "mobile"
        this[deviceType](template);
    }
    码.prototype.runAntiCode = function(template) {
        this.loaded = false;
        this.anti码(template);
    }

    码.prototype.default = initalState;

    码.prototype.mobile = initalState;

    码.prototype.addToFn = function(deviceType, loadFn, unloadFn) {
        var previousFn = _.bind(this[deviceType], this);
        this[deviceType] = function(template) {
            previousFn(template);
            //anti码 is the code to run "in reversed"
            //when the Template is destroyed
            this.anti码 = function(template) {
                if(previousFn.anti码!==undefined)
                    previousFn.anti码(template);
                if(unloadFn!==undefined)
                    _.bind(unloadFn,template)();
            }
            _.bind(loadFn,template)();
        }
    }
    码.prototype.reset = function(forDevice) {
        if(forDevice!==undefined){
            this[forDevice] = initalState;
        }else{
            this.default = initalState;
            this.mobile = initalState;
        }
    }

    //virtual 码 are used to call functions for the actual 码 in ↂ码sↂ
    function virtual码(name){
        this.name = name;
    }
    virtual码.prototype.addToFn = function(deviceType,loadFn,unloadFn){
        ↂ码sↂ[this.name].addToFn(deviceType,loadFn,unloadFn);
        return this;
    }
    virtual码.prototype.reset = function(forDevice){
        ↂ码sↂ[this.name].reset(forDevice);
        return this;
    }

    ↂωↂ.code = function(arg1,arg2,arg3) {
        var 码Name, loadFn, unloadFn;
        if(arg1 !==undefined){
            if(typeof arg1 === "string"){
                码Name = arg1;
                if(arg2!==undefined){
                   loadFn = arg2;
                   unloadFn = arg3;
                }
            }else if(typeof arg1 === "function"){
                //when a runCode isn't given a name;
                //we give it a number as name
                码Name = _.size(ↂ码sↂ);
                loadFn = arg1;
                unloadFn = arg2;
            }else{
                console.log("first parameter must either be a string or function");
                return
            }
        }else{
            码Name = _.size(ↂ码sↂ);
        }
        ↂ码sↂ[码Name] = new 码();
        if(loadFn!=undefined)
            ↂ码sↂ[码Name].addToFn(deviceType, loadFn, unloadFn);
        return new virtual码(码Name);
    }
    ↂωↂ.process = function(TemplateName, 码, initSetting) {
        var tName,bName;
        if(typeof TemplateName === "string"){
            tName = TemplateName;
            bName = TemplateName;
        }else{
            for (key in TemplateName){
                tName = key;
                bName = TemplateName.key;
            }
        }
        var b = new bond(tName, 码, initSetting);
        ↂbondsↂ[bName] = b;
        return b;
    }
    ↂωↂ.mobileView = function(mobile_max_width){
        if($(window).width() < mobile_max_width){
            deviceType = "mobile";
        }else{
            deviceType = "default";
        }
    }
    ↂωↂ.reset = function(码Name,forDevice){
        return ↂ码sↂ[码Name].reset(forDevice);
    }
    ↂωↂ.env = { /* this is where vars are shared among different 码s*/ };
};
TemplateButler = ↂωↂ;
TemplateButler();
TButler = TemplateButler;
