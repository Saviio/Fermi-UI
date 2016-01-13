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

















let mixin = function(instance){
	let dest = this
	if(!dest.$new) throw new Error("caller was not a angular scope object.")

	for (let key in instance) {
		if (!dest[key] && instance.hasOwnProperty(key)) {
			dest[key] = instance[key]
		}
	}
}

//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了一下属性糅杂的小技巧来保证开发体验是一致的。
//so 可能在某些corner case可能会导致工作失常，尚在斟酌中。

export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)
			for (let key in instance) {
				instance[key] = instance[key]
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller

				instance.controller = function (_caller_) {
					return function (...controllerArgs){
						let ins = new Directive(...args)
						let index = controllerOrg.$inject && controllerOrg.$inject.indexOf('$scope')
						let caller = controllerArgs.length > 0 && index !== -1 && index !== undefined
									? controllerArgs[index]
									: ins

						controllerOrg.apply(_caller_ === null ? ins : _caller_, controllerArgs)
						if(typeof ins.passing === 'function'){
							ins.passing.apply(caller, [this].concat(controllerArgs))
						}
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ['$scope']

			} else if(typeof instance.passing === 'function'){
				instance.controller = function (...controllerArgs){
					let [caller] = controllerArgs
					instance.passing.apply(caller, [this])
				}

				instance.controller = () => {}
				instance.controller.$inject = ["$scope"]
			}

			if (typeof instance.compile === 'function') {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args)
					let postLink = compileOrg.apply(ins, compileArgs)

					if(typeof instance.controller === 'function'){
						let inject = instance.controller.$inject
						instance.controller = instance.controller(ins)
						if(instance.controller){
							instance.controller.$inject = inject
						}
					}

					return (...linkArgs) => {
						let scope = linkArgs[0]
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}
						scope::mixin(ins)
					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let scope = linkArgs[0]
					let ins = new Directive(...args)
					linkOrg.apply(ins, linkArgs)
					scope::mixin(ins)
				}
			}

			if(!instance.compile && instance.controller){
				let controllerOrg = instance.controller
				instance.controller = controllerOrg(null)
				instance.controller.$inject = controllerOrg.$inject
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []
