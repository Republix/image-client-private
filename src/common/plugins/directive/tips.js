

import Vue from 'vue'
import TipPrototype from '../../component/tips.vue'

const Tip = Vue.extend(TipPrototype) // 创建一个子类

let tip = null // vue实例
let counter = null // 计时器

/**
 * 鼠标移入事件
 */
const mouseEnterHandler = function (e) {
    let el = e.target // dom，挂载点

    if (tip) {
        clearTimeout(counter)
        counter = setTimeout(() => {
            tip.content = el.dataset.tips // set data
            tip.direction = el.dataset.tipsDirection
    
            const {top, left, right, width, height} = el.getBoundingClientRect()
            switch (tip.direction) {
                case 'left': {
                    tip.$el.style.left = ''
                    tip.$el.style.right = Math.round(right + width + 20 - left) + 'px'
                    tip.$el.style.top = Math.round(top + height/2) + 'px'
                    tip.$el.style.bottom = ''
                    break
                }
                case 'bottom': {
                    tip.$el.style.left = Math.round(left + width / 2) + 'px'
                    tip.$el.style.right = ''
                    tip.$el.style.top = Math.round(top - 10) + 'px'
                    tip.$el.style.bottom = ''
                    break
                }
                default: {
                }
            }
    
            tip.show()
        }, 300)

    } else {
        clearTimeout(counter)
        counter = setTimeout(() => {
            clearTimeout(counter)

            tip = tip || new Tip().$mount()
            tip.content = el.dataset.tips // setData
            tip.direction = el.dataset.tipsDirection

            const {top, right, bottom, left, width, height} = el.getBoundingClientRect()
            
            switch (tip.direction) {
                case 'left': {
                    tip.$el.style.left = ''
                    tip.$el.style.right = Math.round(right + width + 20 - left) + 'px'
                    tip.$el.style.top = Math.round(top + height/2) + 'px'
                    tip.$el.style.bottom = ''
                    break
                }
                case 'bottom': {
                    tip.$el.style.left = Math.round(left + width / 2) + 'px'
                    tip.$el.style.right = ''
                    tip.$el.style.top = Math.round(top - 10) + 'px'
                    tip.$el.style.bottom = ''
                    break
                }
                default: {
                }
            }

            document.body.appendChild(tip.$el)
            tip.show()
        }, 300)
    }
}

/**
 * 鼠标移出事件
 */
const mouseLeaveHandler = function () {
    clearTimeout(counter)
    tip && tip.leave()
}

export default {
    bind(el, {value, modifiers}) {
        el.dataset.tips = value
        el.dataset.tipsDirection = modifiers.right 
                            ? 'right' : modifiers.left 
                            ? 'left' : 'bottom'

        el.addEventListener('mouseenter', mouseEnterHandler)
        el.addEventListener('mouseleave', mouseLeaveHandler)
    },
    unbind(el) {
        el.removeEventListener('mouseenter', mouseEnterHandler)
        el.removeEventListener('mouseleave', mouseLeaveHandler)
    },
    update(el, {value, oldValue}) {
        if (value !== oldValue) {
            el.dataset.tips = value
        }
    }
}