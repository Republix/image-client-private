import Tip from './directive/tips'

export default function (Vue) {
    Vue.directive('focus', {
        inserted: function(el) {
            el.focus()
        }
    })

    // in some.vue
    // directives: {
    //  focus: { inserted: function(el) { el.focus } }       
    // }
    Vue.directive('tips', Tip)
}