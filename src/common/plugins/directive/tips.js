

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

        tip.content = el.dataset.tips // set data

        const {top, left, width, height} = el.getBoundingClientRect()

        tip.$el.style.left = Math.round(left + width / 2) + 'px'
        tip.$el.style.right = '';
        tip.$el.style.top = Math.round(top - 10) + 'px';
        tip.$el.style.bottom = '';

        tip.show()
    } else {
        clearTimeout(counter)
        counter = setTimeout(() => {
            clearTimeout(counter)

            tip = tip || new Tip().$mount()
            console.log(tip.$el)
            tip.message = el.dataset.title2 // setData
            console.log(tip.$el)
            const {top, right, bottom, left, width, height} = el.getBoundingClientRect()

            tip.$el.style.left = Math.round(left + width / 2) + 'px'
            tip.$el.style.right = '';
            tip.$el.style.top = Math.round(top - 10) + 'px';
            tip.$el.style.bottom = '';
            document.body.appendChild(tip.$el)
            tip.show()
        }, 100)
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
    bind(el, binding) {
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