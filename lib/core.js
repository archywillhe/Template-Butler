//Fun fact: Butler is initially known as "Fermions" (which doesn't matter now) and pauli exclusion principle states that fermions cannot share the same quantum states 
//Read more here http://en.wikipedia.org/wiki/Pauli_exclusion_principle

Butler  = function() {
    var deviceType = "default",
        _JSONcodes = {},
        _JSONbonds= {};

    //Fun fact: bond is intially known as "quark" (which doesn't matter now)

    //bond is used to bind a template with code blocks (codes)
    function bond(templateName, code, initSetting) {
        this.code = code || [];
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
                        Butler.env[key] = initSetting[key];
                    }
                }
                previousFn();
            }
            previousFn = template.rendered || function(){};
            template.rendered = _.bind(function() {
                this.loaded = true;
                this.loadcodes(template);
                previousFn();
            }, this);
            previousFn = template.destroyed || function(){};
            template.destroyed = _.bind(function() {
                this.loaded = false;
                this.unloadcodes(template);
                previousFn();
            }, this);
        }
    }

    //default empty arrays/function to be over-written
    bond.prototype.bondsToDependOn = [];
    bond.prototype.Xtracodes = [];

    bond.prototype.depends = function(bonds) {
        this.bondsToDependOn = this.bondsToDependOn.concat(bonds);
    }

    bond.prototype.loadcodes = function(template) {
        var dependedLoaded = true,
            notloadedQuark,
            futureQuark;
        for (key in this.bondsToDependOn) {
            if (_bonds_[this.bondsToDependOn[key]].loaded !== true) {
                dependedLoaded = false;
                futureQuark = _bonds_[this.bondsToDependOn[key]];
                break;
            }
        }
        //nothing happens if there is no extra code
        if (this.Xtracodes === []) {
            this.codes = this.code;
        } else {
            this.codes = this.code.concat(this.Xtracodes);
            //clean Xtracodes afterwards because extra code are added 
            //only when a bond's dependent bond is not loaded
            this.Xtracodes = [];
        }
        if (dependedLoaded === true) {
            for (key in this.codes) {
                if(typeof this.codes[key] === "string"){
                    _JSONcodes[this.codes[key]].runCode(template);
                }else{
                    _JSONcodes[this.codes[key].name].runCode(template);
                }
            }
        } else {
            futureQuark.Xtracodes = futureQuark.Xtracodes.concat(this.codes);
        }
    }

    bond.prototype.unloadcodes = function(template) {
        for (key in this.codes) {
           if(typeof this.codes[key] === "string"){
                _JSONcodes[this.codes[key]].runAntiCode(template);
            }else{
                _JSONcodes[this.codes[key].name].runAntiCode(template);
            }
        }
    }

    var initalState = function(template) {
    };

    //Fun fact: code is intially known as "lepton" (which doesn't matter now)

    //code consists of 2 pieces of code:
    //1st piece runs when Template rendered.
    //2nd piece runs when Template destroyed.
    function code() {
        this.firstLoaded = false;
    }

    code.prototype.runCode = function(template) {
        this.firstLoaded = true;
        this.loaded = true;
        //deviceType = "default" or "mobile"
        this[deviceType](template);
    }
    code.prototype.runAntiCode = function(template) {
        this.loaded = false;
        this.anticode(template);
    }

    code.prototype.default = initalState;

    code.prototype.mobile = initalState;

    code.prototype.addToFn = function(deviceType, loadFn, unloadFn) {
        var previousFn = _.bind(this[deviceType], this);
        this[deviceType] = function(template) {
            previousFn(template);
            //anticode is the code to run "in reversed"
            //when the Template is destroyed
            this.anticode = function(template) {
                if(previousFn.anticode!==undefined)
                    previousFn.anticode(template);
                if(unloadFn!==undefined)
                    _.bind(unloadFn,template)();
            }
            _.bind(loadFn,template)();
        }
    }
    code.prototype.reset = function(forDevice) {
        if(forDevice!==undefined){
            this[forDevice] = initalState;
        }else{
            this.default = initalState;
            this.mobile = initalState;
        }
    }

    //virtual code are used to call functions for the actual code in _JSONcodes
    function virtualcode(name){
        this.name = name;
    }
    virtualcode.prototype.addToFn = function(deviceType,loadFn,unloadFn){
        _JSONcodes[this.name].addToFn(deviceType,loadFn,unloadFn);
        return this;
    }
    virtualcode.prototype.reset = function(forDevice){
        _JSONcodes[this.name].reset(forDevice);
        return this;
    }

    Butler.code = function(arg1,arg2,arg3) {
        var codeName, loadFn, unloadFn;
        if(arg1 !==undefined){
            if(typeof arg1 === "string"){
                codeName = arg1;
                if(arg2!==undefined){
                   loadFn = arg2;
                   unloadFn = arg3;
                }
            }else if(typeof arg1 === "function"){
                //when a runCode isn't given a name;
                //we give it a number as name
                codeName = _.size(_JSONcodes);
                loadFn = arg1;
                unloadFn = arg2;
            }else{
                console.log("first parameter must either be a string or function");
                return
            }
        }else{
            codeName = _.size(_JSONcodes);
        }
        _JSONcodes[codeName] = new code();
        if(loadFn!=undefined)
            _JSONcodes[codeName].addToFn(deviceType, loadFn, unloadFn);
        return new virtualcode(codeName);
    }
    Butler.process = function(TemplateName, code, initSetting) {
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
        var b = new bond(tName, code, initSetting);
        _bonds_[bName] = b;
        return b;
    }
    Butler.mobileView = function(mobile_max_width){
        if($(window).width() < mobile_max_width){
            deviceType = "mobile";
        }else{
            deviceType = "default";
        }
    }
    Butler.reset = function(codeName,forDevice){
        return _JSONcodes[codeName].reset(forDevice);
    }
    Butler.env = { /* this is where vars are shared among different codes*/ };
};
TemplateButler = Butler;
TemplateButler();
TButler = TemplateButler;
