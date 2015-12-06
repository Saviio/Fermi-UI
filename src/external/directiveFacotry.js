"use strict"

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
					let instance = new Directive(...args)
					linkOrg.apply(instance, linkArgs)
				}
			}

			if (instance.compile) {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let instance = new Directive(...args)
					let postLink = compileOrg.apply(instance, compileArgs)
					if(postLink !== undefined){
						return postLink.bind(instance)
					}
				}
			}

			if (instance.controller) {
				let controllerOrg = instance.controller

				instance.controller = function (...controllerArgs) {
					let instance = new Directive(...args)
					controllerOrg.apply(instance, controllerArgs)

					if(typeof instance.passing === 'function'){
						instance.passing.apply(instance, [this].concat(controllerArgs))
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"] //尝试从controller开始挂
			}

			return instance
		}

		factory.$inject = Directive.$inject || []

		return factory
	}
}

DirectiveFactory.$inject = []
