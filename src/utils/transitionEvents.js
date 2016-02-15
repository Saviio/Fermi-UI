import { WIN as win } from './browser'

const isWebkitTrans = win.ontransitionend === undefined && win.onwebkittransitionend !== undefined
const isWebkitAnim = win.onanimationend === undefined && win.onwebkitanimationend !== undefined

let transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition'
let transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend'
let animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation'
let animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend'


export {
    transitionProp,
    transitionEndEvent,
    animationProp,
    animationEndEvent
}
