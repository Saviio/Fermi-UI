"use strict"

export default class DirectiveFactory {
	//基于ES6 Class的 Angular Directive 无法完全通过this[[key]]来访问实例属性，只有在部分情况下，比如 compile 和 link同时存在时，由于手动bind了caller，因此被允许使用。
	//Directive controller 函数是多实例共享的，因此无法通过this获取属性，如果需要在实例上共享属性，建议依从以下方式
	// compile => link : [this]
	// controller <=> link : [scope]
	
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
					let ins = new Directive(...args)
					let postLink = compileOrg.apply(ins, compileArgs)
					if(postLink !== undefined){
						return postLink.bind(ins)
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
				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"]
			}

			return instance
		}

		factory.$inject = Directive.$inject || []

		return factory
	}
}

DirectiveFactory.$inject = []
