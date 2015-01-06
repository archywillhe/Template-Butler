//Fun fact: pauli exclusion principle states that fermions cannot share the same quantum states 
//Read more here http://en.wikipedia.org/wiki/Pauli_exclusion_principle
"user strict"
fermions = (function() {
    var deviceType,
        leptonsList = {},
        quarksList = {};

    //a quark is used to represent a template
    function quark(templateName, leptons, initSetting) {
        this.leptons = leptons || [];
        try {
            this.Template = Template[templateName];
        } catch (e) {
            console.log("Hey man the Template " + templateName + " can't be found: a quark has not been successfully constructed :(");
        } finally {
            //3 states: create, render, destroy
            this.Template.created = function() {
                if (initSetting !== undefined) {
                    initSetting.forEach(function(item,key) {
                        fermions.env[key] = item;
                    });
                }
            }
            this.Template.rendered = _.bind(function() {
                this.loaded = true;
                this.loadLeptons();
            }, this);
            this.Template.destroyed = _.bind(function() {
                this.loaded = false;
                this.unloadLeptons();
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
            //         leptonsList[leptonPair].lepton(this.Template);
            //     }else{
            //         leptonPair.lepton(this.Template);
            //     }
            // }
            for (key in this.leptonPairs) {
                //load a lepton
                if(typeof this.leptonPairs[key] === "string"){
                    leptonsList[this.leptonPairs[key]].lepton(this.Template);
                }else{
                    this.leptonPairs[key].lepton(this.Template);
                }
            }
        } else {
            futureQuark.XtraLeptons = futureQuark.XtraLeptons.concat(this.leptonPairs);
        }
    }

    quark.prototype.unloadLeptons = function() {
        // for (leptonPair of this.leptonPairs) {
        //     //load an anti-Lepton
        //     leptonsList[leptonPair].antiLepton(this.Template);
        // }
        for (key in this.leptonPairs) {
            //load an anti-Lepton
            leptonsList[this.leptonPairs[key]].antiLepton(this.Template);
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

    leptonPair.prototype.lepton = function(template) {
        this.firstLoaded = true;
        this.loaded = true;
        switch (deviceType) {
            case "Mobile":
                this.antiParticle = this.mobile.apply(template);
                break;
            default:
                this.antiParticle = this.default.apply(template);
        }
    }
    leptonPair.prototype.antiLepton = function(template) {
        this.loaded = false;
        this.antiParticle.apply(template);
    }

    leptonPair.prototype.default = initalState;

    leptonPair.prototype.mobile = initalState;

    leptonPair.prototype.addToFn = function(name, loadFn, unloadFn) {
        var previousFn = _.bind(this[name], this);
        this[name] = function() {
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
    }
    leptonPair.prototype.reset = function(name) {
        if(name!==undefined){
            this[name] = initalState;
        }else{
            this.default = initalState;
            this.mobile = initalState;
        }
    }

    fermions.lepton = function(name) {
        var l = new leptonPair();
        if(name !==undefined){
            l.name = name;
        }else{
            l.name = leptonsList.length;
        }
        leptonsList[l.name] = l;
        return l;
    }
    fermions.quark = function(TemplateName, leptons, initSetting) {
        var q = new quark(TemplateName, leptons, initSetting);
        quarksList[TemplateName] = q;
        return q;
    }
    fermions.mobileView = function(mobile_max_width){
        if($(window).width() < mobile_max_width){
            deviceType = "Mobile";
        }
    }
    fermions.env = { /* this is where vars are shared among different fermions*/ };
})();
