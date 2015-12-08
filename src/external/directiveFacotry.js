let mixin = function(instance){
	let dest = this
	if(!dest.$new) throw new Error("caller was not a angular scope variable.")
	let ignore = ['restrict', 'replace', 'template', 'require', 'scope', 'transclude']

	for (let key in instance) {
		if (!dest[key] && instance.hasOwnProperty(key)) {
			dest[key] = instance[key]
		} else if(dest[key] && ignore.indexOf(key) ===-1 ) {
			throw new Error(`Duplicated Property between directive instance and scope. Property: ${key}`)
		} else if(dest[key] && ignore.indexOf(key) >= 0 && dest[key] !== instance[key]){
			throw new Error(`Property confict between directive and scope. Property: ${key}`)
		}
	}
}

export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)
			for (let key in instance) {
				instance[key] = instance[key]
			}


			if (instance.link && !instance.compile) {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let scope = linkArgs[0]
					let instance = new Directive(...args)
					linkOrg.apply(instance, linkArgs)
					scope::mixin(instance)
				}
			}

			if (instance.compile) {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let instance = new Directive(...args)
					let postLink = compileOrg.apply(instance, compileArgs)

					if(postLink !== undefined){
						return (...linkArgs) => {
							let scope = linkArgs[0]
							postLink.apply(instance, linkArgs)
							scope::mixin(instance)
						}
					}
				}
			}

			if (instance.controller) {
				let controllerOrg = instance.controller

				instance.controller = function (...controllerArgs) {
					let instance = new Directive(...args)
					let index = controllerOrg.$inject && controllerOrg.$inject.indexOf('$scope')
					let caller = controllerArgs.length > 0 && index !== -1 ? controllerArgs[index] : instance
					controllerOrg.apply(caller, controllerArgs)
					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"]
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []
