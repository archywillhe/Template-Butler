//Fun fact: Butler is initially known as fermions and pauli exclusion principle states that fermions cannot share the same quantum states 
//Read more here http://en.wikipedia.org/wiki/Pauli_exclusion_principle
"user strict"
Butler = function() {
    var deviceType = "default",
        leptonsList = {},
        quarksList = {};

    //a quark is used to represent a template
    function quark(templateName, leptons, initSetting) {
        this.leptons = leptons || [];
        try {
            var template = Template[templateName];
        } catch (e) {
            console.log("Hey man the Template " + templateName + " can't be found: a bond has not been successfully constructed :(");
        } finally {
            //3 states: create, render, destroy
            var previousFn = template.created || function(){};
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
                this.loadLeptons();
                previousFn();
            }, this);
            previousFn = template.destroyed || function(){};
            template.destroyed = _.bind(function() {
                this.loaded = false;
                this.unloadLeptons();
                previousFn();
            }, this);
        }
    }

    //default empty arrays/function to be over-written
    quark.prototype.quarksToDependOn = [];
    quark.prototype.XtraLeptons = [];

    quark.prototype.depends = function(quarks) {
        this.quarksToDependOn = this.quarksToDependOn.concat(quarks);
    }

    quark.prototype.loadLeptons = function() {
        var dependedLoaded = true,
            notloadedQuark,
            futureQuark;
        for (key in this.quarksToDependOn) {
            if (quarksList[this.quarksToDependOn[key]].loaded !== true) {
                dependedLoaded = false;
                futureQuark = quarksList[this.quarksToDependOn[key]];
                break;
            }
        }
        //nothing happens if there is no extra leptons
        if (this.XtraLeptons === []) {
            this.leptonPairs = this.leptons;
        } else {
            this.leptonPairs = this.leptons.concat(this.XtraLeptons);
            //clean XtraLeptons afterwards because extra leptons are added 
            //only when a quark's dependent quark is not loaded
            this.XtraLeptons = [];
        }
        if (dependedLoaded === true) {
            for (key in this.leptonPairs) {
                //load a lepton
                if(typeof this.leptonPairs[key] === "string"){
                    leptonsList[this.leptonPairs[key]].lepton();
                }else{
                    leptonsList[this.leptonPairs[key].name].lepton();
                }
            }
        } else {
            futureQuark.XtraLeptons = futureQuark.XtraLeptons.concat(this.leptonPairs);
        }
    }

    quark.prototype.unloadLeptons = function() {
        for (key in this.leptonPairs) {
            //load an anti-Lepton
           if(typeof this.leptonPairs[key] === "string"){
                leptonsList[this.leptonPairs[key]].antiLepton();
            }else{
                leptonsList[this.leptonPairs[key].name].antiLepton();
            }
        }
    }

    var initalState = function() {
    };

    //a quark can take in as many leptonPairs as possible
    //leptonPair consists of a lepton and an anti-lepton
    //a lepton is used to represent a reusable block of code to run when a Template rendered
    //an anti-lepton is used to represent the code to run when Template destroyed.
    function leptonPair() {
        this.firstLoaded = false;
    }

    leptonPair.prototype.lepton = function() {
        this.firstLoaded = true;
        this.loaded = true;
        this[deviceType]();
    }
    leptonPair.prototype.antiLepton = function() {
        this.loaded = false;
        this.antiParticle();
    }

    leptonPair.prototype.default = initalState;

    leptonPair.prototype.mobile = initalState;

    leptonPair.prototype.addToFn = function(deviceType, loadFn, unloadFn) {
        var previousFn = _.bind(this[deviceType], this);
        this[deviceType] = function() {
            previousFn();
            this.antiParticle = function() {
                //returning an anti-Lepton
                if(previousFn.antiParticle!==undefined)
                    previousFn.antiParticle();
                if(unloadFn!==undefined)
                    unloadFn();
            }
            loadFn();
        }
    }
    leptonPair.prototype.reset = function(name) {
        if(name!==undefined){
            this[name] = initalState;
        }else{
            this.default = initalState;
            this.mobile = initalState;
        }
    }

    //virtual leptons are used to call functions for the actual leptons in leptonsList
    function virtualLepton(name){
        this.name = name;
    }
    virtualLepton.prototype.addToFn = function(deviceType,loadFn,unloadFn){
        leptonsList[this.name].addToFn(deviceType,loadFn,unloadFn);
        return this;
    }
    virtualLepton.prototype.reset = function(name){
        leptonsList[this.name].reset(name);
        return this;
    }

    Butler.lepton = function(arg1,arg2,arg3) {
        var lName, loadFn, unloadFn;
        if(arg1 !==undefined){
            if(typeof arg1 === "string"){
                lName = arg1;
                if(arg2!==undefined){
                   loadFn = arg2;
                   unloadFn = arg3;
                }
            }else if(typeof arg1 === "function"){
                //when a lepton isn't given a name;
                //we give it a number as name
                lName = _.size(leptonsList);
                loadFn = arg1;
                unloadFn = arg2;
            }else{
                console.log("first parameter must either be a string or function");
                return
            }
        }else{
            lName = _.size(leptonsList);
        }
        leptonsList[lName] = new leptonPair();
        if(loadFn!=undefined)
            leptonsList[lName].addToFn(deviceType, loadFn, unloadFn);
        return new virtualLepton(lName);
    }
    Butler.quark = function(TemplateName, leptons, initSetting) {
        var TName,QName;
        if(typeof TemplateName === "string"){
            TName = TemplateName;
            QName = TemplateName;
        }else{
            for (key in TemplateName){
                TName = key;
                QName = TemplateName.key;
            }
        }
        var q = new quark(TName, leptons, initSetting);
        quarksList[QName] = q;
        return q;
    }
    Butler.mobileView = function(mobile_max_width){
        if($(window).width() < mobile_max_width){
            deviceType = "mobile";
        }else{
            deviceType = "default";
        }
    }
    Butler.makeLogic = function(){
        return Butler.lepton.apply(Butler,arguments);
    }
    Butler.bond = function(){
        return Butler.quark.apply(Butler,arguments);
    }
    Butler.env = { /* this is where vars are shared among different Butler*/ };
};
Butler();
