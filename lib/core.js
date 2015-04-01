Butler  = function() {
    var deviceType = "default", 
    $CODES = {}, $PROCESSES= {};

    function process(templateName, code, initSetting) {
        this.code = code || [];
        try {
            var template = Template[templateName];
        } catch (e) {
            console.log("Hey man the Template " + templateName + " can't be found: a process has not been successfully constructed :(");
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
                this.loadCodes(template);
                previousFn();
            }, this);
            previousFn = template.destroyed || function(){};
            template.destroyed = _.bind(function() {
                this.loaded = false;
                this.unloadCodes(template);
                previousFn();
            }, this);
        }
    }

    process.prototype.processesToDependOn = [];
    process.prototype.Xtracodes = [];

    process.prototype.depends = function(processes) {
        this.processesToDependOn = this.processesToDependOn.concat(processes);
    }

    process.prototype.loadCodes = function(template) {
        var dependedLoaded = true,
            notloadedQuark,
            futureQuark;
        for (key in this.processesToDependOn) {
            if ($PROCESSES[this.processesToDependOn[key]].loaded !== true) {
                dependedLoaded = false;
                futureQuark = $PROCESSES[this.processesToDependOn[key]];
                break;
            }
        }
        //nothing happens if there is no extra code
        if (this.Xtracodes === []) {
            this.codes = this.code;
        } else {
            this.codes = this.code.concat(this.Xtracodes);
            //clean Xtracodes afterwards because extra code are added 
            //only when a process's dependent process is not loaded
            this.Xtracodes = [];
        }
        if (dependedLoaded === true) {
            for (key in this.codes) {
                if(typeof this.codes[key] === "string"){
                    $CODES[this.codes[key]].runCode(template);
                }else{
                    $CODES[this.codes[key].name].runCode(template);
                }
            }
        } else {
            futureQuark.Xtracodes = futureQuark.Xtracodes.concat(this.codes);
        }
    }

    process.prototype.unloadCodes = function(template) {
        for (key in this.codes) {
           if(typeof this.codes[key] === "string"){
                $CODES[this.codes[key]].runAntiCode(template);
            }else{
                $CODES[this.codes[key].name].runAntiCode(template);
            }
        }
    }

    var initalState = function(template) {
    };

    //consists of 2 pieces of code:
    //1st piece runs when Template rendered. (runCode)
    //2nd piece runs when Template destroyed. (runAntiCode)
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
        this.antiCode(template);
    }

    code.prototype.default = initalState;

    code.prototype.mobile = initalState;

    code.prototype.addToFn = function(deviceType, loadFn, unloadFn) {
        var previousFn = _.bind(this[deviceType], this);
        this[deviceType] = function(template) {
            previousFn(template);
            //antiCode is the code to run "in reversed"
            //when the Template is destroyed
            this.antiCode = function(template) {
                if(previousFn.antiCode!==undefined)
                    previousFn.antiCode(template);
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

    //virtualCode is used to call functions for the actual code in $CODES
    function virtualCode(name){
        this.name = name;
    }
    virtualCode.prototype.addToFn = function(deviceType,loadFn,unloadFn){
        $CODES[this.name].addToFn(deviceType,loadFn,unloadFn);
        return this;
    }
    virtualCode.prototype.reset = function(forDevice){
        $CODES[this.name].reset(forDevice);
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
                codeName = _.size($CODES);
                loadFn = arg1;
                unloadFn = arg2;
            }else{
                console.log("first parameter must either be a string or function");
                return
            }
        }else{
            codeName = _.size($CODES);
        }
        $CODES[codeName] = new code();
        if(loadFn!=undefined)
            $CODES[codeName].addToFn(deviceType, loadFn, unloadFn);
        return new virtualCode(codeName);
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
        var b = new process(tName, code, initSetting);
        $PROCESSES[bName] = b;
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
        return $CODES[codeName].reset(forDevice);
    }
    Butler.env = { /* this is where vars are shared among different codes*/ };
};
TemplateButler = Butler;
TemplateButler();
TButler = TemplateButler;
