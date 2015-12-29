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

			if (typeof instance.compile === 'function') {
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
					} else {
						scope::mixin(instance)
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

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller

				instance.controller = function (...controllerArgs) {
					let instance = new Directive(...args)
					let index = controllerOrg.$inject && controllerOrg.$inject.indexOf('$scope')
					let caller = controllerArgs.length > 0 && index !== -1 && index !== undefined
								? controllerArgs[index]
								: instance

					controllerOrg.apply(caller, controllerArgs)
					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ["$scope"]
			} else if(typeof instance.passing === 'function'){
				instance.controller = function (...controllerArgs){
					let [caller] = controllerArgs
					instance.passing.apply(caller, [this])
				}

				instance.controller = () => {}
				instance.controller.$inject = ["$scope"]
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []
