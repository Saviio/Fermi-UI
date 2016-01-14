import cache from '../utils/cache'
import { generateFermiId } from '../utils'

let mixin = function(instance){
	let dest = this
	if(!dest.$new) throw new Error("caller was not a angular scope object.")

	for (let key in instance) {
		if (!dest[key] /*&& instance.hasOwnProperty(key)*/) {
			dest[key] = instance[key]
		}
	}
}

//写一个cache对象，key => randomToken，tagged in rootElement， 当执行到controller方法时，获取通过elem获取之前instance的实例，然后从element以及cache上remove掉，将实例状态与scope mixin invoke as caller
//写一个浅拷贝带ignore key的function

//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了一下属性糅杂的小技巧来保证开发体验是一致的。
//so 可能在某些corner case可能会导致工作失常，尚在斟酌中。

let __cache__ = new cache()
window.ccc=__cache__

const FermiIdenitifer = 'data-fermiId'

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
					let ins = new Directive(...args)
					let [$elem, ...restArgs] = compileArgs
					let postLink = compileOrg.apply(ins, compileArgs)
					let id = generateFermiId()
					__cache__.add(id, ins)
					$elem.attr('data-fmId', id)

					return (...linkArgs) => {
						let [scope, $elem, ...restArgs] = linkArgs
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}
						$elem.removeAttr('data-fmId')

					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let [scope, $elem, ...restArgs] = linkArgs
					let fmId = $elem.attr('data-fmId')
					let caller
					if(fmId !== undefined){
						caller = __cache__.remove(fmId)
					} else {
						caller = new Directive(...args) //remark 更换了顺序，review
					}

					linkOrg.apply(caller, linkArgs)
				}
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller
				instance.controller.$inject = instance.controller.$inject || ['$scope', '$element']


				if(instance.controller.$inject.indexOf('$scope') === -1){
					instance.controller.$inject = [
						...instance.controller.$inject , '$scope'
					]
				}

				//debugger
				if(instance.controller.$inject.indexOf('$element') === -1){
					instance.controller.$inject  = [
						...instance.controller.$inject , '$element'
					]
				}


				instance.controller = function (...controllerArgs) {
					let scopeIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$scope')
					let elemIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$element')
					let $elem = elemIndex !== -1 && elemIndex !== undefined && controllerArgs[elemIndex]
					//debugger
					let fmId = $elem.attr('data-fmId')
					let caller
					if(fmId !== undefined){
						caller = __cache__.get(fmId)
					} else {
						caller = new Directive(...args)
						let id = generateFermiId()
						__cache__.add(id, caller)
						$elem.attr('data-fmId', id)
					}

					controllerOrg.apply(caller, controllerArgs)

					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}

					if(typeof instance.link !== 'function' && fmId !== undefined){
						$elem.removeAttr('data-fmId')
						__cache__.remove(fmId)
					}
				}

				instance.controller.$inject = controllerOrg.$inject

			} else if(typeof instance.passing === 'function'){
				instance.controller = function (...controllerArgs){
					let [scope, $elem, ...restArgs] = controllerArgs
					let fmId = $elem.attr('data-fmId')
					let caller
					if(fmId !== undefined){
						caller = __cache__.get(fmId)
					} else {
						caller = new Directive(...args)
						let id = generateFermiId()
						__cache__.add(id, caller)
						$elem.attr('data-fmId', id)
					}

					instance.passing.apply(caller, [this])
				}

				instance.controller = () => {}
				instance.controller.$inject = ['$scope', '$element']
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []
