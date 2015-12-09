import { noop } from '../utils'

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

//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此Factory里用了一点caller变换、属性糅杂的小技巧来保证开发体验是一致的。
//在某些corner case可能会导致工作失常，如果遇到请报issue。

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
					let ins = new Directive(...args)
					linkOrg.apply(ins, linkArgs)
					scope::mixin(ins)
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
					} else {
						scope::mixin(instance)
					}
				}
			}

			if (instance.controller) {
				let controllerOrg = instance.controller

				instance.controller = function (...controllerArgs) {
					let instance = new Directive(...args)
					let index = controllerOrg.$inject && controllerOrg.$inject.indexOf('$scope')
					let caller = controllerArgs.length > 0 && (index !== -1 && index !== undefined)
								? controllerArgs[index]
								: instance

					controllerOrg.apply(caller, controllerArgs)
					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"]
			}

			if(typeof instance.passing === 'function' && !instance.controller){
				instance.controller = function (...controllerArgs){
					let [caller] = controllerArgs
					instance.passing.apply(caller, [this])
				}

				instance.controller = noop
				instance.controller.$inject = ["$scope"]
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []
