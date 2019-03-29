import Modal from '../component/modal.vue';

import directive from './directive';

/**
 * 
 */
const typeExtend = () => {
        /**
         * 日期扩展
         * by meizz
         */
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
}

/**
 * @note
 * - vue.$el 获取挂载点 
 * @todo
 * 
 */
const mountComponent = (Vue) => {

    /**
     * 手动设置
     */
    Vue.prototype.$confirm = function (title, content) {
        return new Promise(function (resolve, reject) {
            const confirm = new Vue({
                render: function (h) {
                    return (
                        <modal title={title} onCancel={this.cancel} onConfirm={this.sure}>
                            <p>{content}</p>
                        </modal>
                    )
                },
                methods: {
                    cancel () {
                        reject(false)
                        document.body.removeChild(newConfirm.$el)
                        confirm.$destory()
                    },
                    sure () {
                        resolve(true)
                        document.body.removeChild(newConfirm.$el)
                        confirm.$destory()
                    }
                }
            }).$mount()

            document.body.appendChild(confirm.$el)
        })
    }

    Vue.prototype.$toast = function (message, type, duration = 1500) {
        if (toast === null) {
            toast = new Vue(Toast)
        }
    }
}

/**
 * 全局
 */
const commonComponent = (Vue) => {
    Vue.component(Modal.name, Modal)
}


export default {
    install (Vue) {
        // 绑定在Vue.prototype下组件
        mountComponent(Vue)
        // 类型扩展
        typeExtend()
        // 公共组件
        commonComponent(Vue)
        // 指令
        directive(Vue)
    }
}