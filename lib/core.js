//Fun fact: pauli exclusion principle states that fermions cannot share the same quantum states 
//Read more here http://en.wikipedia.org/wiki/Pauli_exclusion_principle
"user strict"
fermions = function() {
    var deviceType = "default",
        leptonsList = {},
        quarksList = {};

    //a quark is used to represent a template
    function quark(templateName, leptons, initSetting) {
        this.leptons = leptons || [];
        try {
            var template = Template[templateName];
        } catch (e) {
            console.log("Hey man the Template " + templateName + " can't be found: a quark has not been successfully constructed :(");
        } finally {
            //3 states: create, render, destroy
            var previousFn = template.created || function(){};
            template.created = function() {
                if (initSetting !== undefined) {
                    for(key in initSetting){
                        fermions.env[key] = initSetting[key];
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
        // for (quark of this.quarksToDependOn) {
        //     if (quarksList[quark].loaded !== true) {
        //         dependedLoaded = false;
        //         futureQuark = quarksList[quark];
        //         break;
        //     }
        // }
        for (key in this.quarksToDependOn) {
            if (quarksList[this.quarksToDependOn[key]].loaded !== true) {
                dependedLoaded = false;
                futureQuark = quarksList[this.quarksToDependOn[key]];
                break;
            }
        }
        if (this.XtraLeptons === []) {
            this.leptonPairs = this.leptons;
        } else {
            this.leptonPairs = this.leptons.concat(this.XtraLeptons);
            //clean XtraLeptons afterwards because extra leptons are added 
            //only when a quark's dependent quark is not loaded
            this.XtraLeptons = [];
        }
        if (dependedLoaded === true) {
            // for (leptonPair in this.leptonPairs) {
            //     //load a lepton
            //     if(typeof leptonPair === "string"){
            //         leptonsList[leptonPair].lepton();
            //     }else{
            //         leptonPair.lepton();
            //     }
            // }
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
        // for (leptonPair of this.leptonPairs) {
        //     //load an anti-Lepton
        //     leptonsList[leptonPair].antiLepton();
        // }
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
        return function() {}
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
        this.antiParticle = this[deviceType]();
    }
    leptonPair.prototype.antiLepton = function() {
        this.loaded = false;
        this.antiParticle.apply();
    }

    leptonPair.prototype.default = initalState;

    leptonPair.prototype.mobile = initalState;

    leptonPair.prototype.addToFn = function(deviceType, loadFn, unloadFn) {
        var previousFn = _.bind(this[deviceType], this);
        this[deviceType] = function() {
            var previousUnload = previousFn();
            loadFn();
            return function() {
                //returning an anti-Lepton
                previousUnload();
                if(unloadFn!==undefined){
                    unloadFn();
                }
            }
        }
        return this;
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
    }
    virtualLepton.prototype.reset = function(name){
        leptonsList[this.name].reset(name);
    }

    fermions.lepton = function(name,loadFn, unloadFn) {
        var l = new leptonPair();
        if(name !==undefined){
            if(typeof name === "string"){
                l.name = name;
                if(loadFn!==undefined){
                    l.addToFn(deviceType, loadFn, unloadFn);
                }
            }else if(typeof name === "function"){
                //assume first arguement name is a loadFn
                //and assume second arguement loadFn is unloadFn
                l.addToFn(deviceType, name, loadFn);
            }else{
                return
            }
        }else{
            l.name = _.size(leptonsList);
        }
        leptonsList[l.name] = l;
        return new virtualLepton(l.name);
    }
    fermions.quark = function(TemplateName, leptons, initSetting) {
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
    fermions.mobileView = function(mobile_max_width){
        if($(window).width() < mobile_max_width){
            deviceType = "mobile";
        }
    }
    fermions.env = { /* this is where vars are shared among different fermions*/ };
};
fermions();
