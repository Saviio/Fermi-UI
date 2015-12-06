if(instance.controller){
    let controllerOrg = instance.controller;

    instance.controller = function (...controllerArgs) {
        let instance = new Directive(...args);
        controllerOrg.apply(instance, controllerArgs);

        if(typeof instance.passing === 'function'){
            instance.passing.apply(instance, [this].concat(controllerArgs))
        }
    };

    instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"];
}

if(instance.compile){
    let compileOrg = instance.compile;
    instance.compile = function (...compileArgs){
        let postLink = compileOrg.apply(instance, compileArgs);
        if(postLink !== undefined){
            return postLink.bind(instance)
        }
    }
}

if(instance.link){
    instance.link = instance.link.bind(instance)
}








"use strict";

export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args);
			for (let key in instance) {
				instance[key] = instance[key];
			}

			let controllerFn = null

			if(instance.controller){
				controllerFn = instance.controller
			}

			if (instance.link) {
				let linkOrg = instance.link;
				instance.link = function (...linkArgs) {
					let ins = new Directive(...args);
					linkOrg.apply(ins, linkArgs);
					if(instance.controller){

						instance.controller = function (...controllerArgs) {

							console.log(...controllerArgs)
							controllerFn.apply(ins, controllerArgs);

							if(typeof instance.passing === 'function'){
								instance.passing.apply(ins, [this].concat(controllerArgs))
							}
						}
					}
				};
			}

			if (instance.compile) {
				let compileOrg = instance.compile;
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args);
					let postLink = compileOrg.apply(ins, compileArgs);
					if(postLink !== undefined){
						return postLink.bind(ins)
					}
				};
			}

			if (instance.controller ) {
				let controllerOrg = instance.controller;

				instance.controller = function (...controllerArgs) {
					let ins = new Directive(...args);
					controllerOrg.apply(ins, controllerArgs);

					if(typeof instance.passing === 'function'){
						instance.passing.apply(ins, [this].concat(controllerArgs))
					}
				};

				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"];
			}

			return instance;
		};

		factory.$inject = Directive.$inject || [];

		return factory;
	}
}

DirectiveFactory.$inject = [];
