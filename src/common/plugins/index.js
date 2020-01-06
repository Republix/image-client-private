import Modal from '../component/modal.vue';
import Toast from '../component/toast.vue';
import Loading from '../component/loading.vue';

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

    let appToast = null
    let loading = null

    /**
     * 手动设置
     */
    Vue.prototype.$confirm = function (title, content) {
        return new Promise(function (resolve, reject) {
            const newConfirm = new Vue({
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
    
    /**
     * 显示一个受时间影响的Toast
     */
    Vue.prototype.$toast = function (message, {duration, icon, type} = {}) {
        if (appToast === null) {
            appToast = new Vue(Toast).$mount()
            document.body.appendChild(appToast.$el)
        }
        appToast.message = message
        appToast.duration = duration || 1500
        appToast.icon = icon || ''
        appToast.type = type || ''
        appToast.show()
    }

    /**
     * 返回实例的Toast
     */
    Vue.prototype.$message = function (message, {duration, icon, type} = {}) {
        if (appToast === null) {
            appToast = new Vue(Toast).$mount()
            document.body.appendChild(appToast.$el)
        }
        appToast.message = message
        appToast.duration = duration || 1500
        appToast.icon = icon || ''
        appToast.type = type || ''
        appToast.show()
        return appToast
    }

    Vue.prototype.$loading = function () {
        if (loading === null) {
            loading = new Vue(Loading).$mount()
            document.body.appendChild(loading.$el)
        }
        loading.show()
        return loading
    }
}

/**
 * 全局
 */
const commonComponent = (Vue) => {
    Vue.component(Modal.name, Modal)
    Vue.component(Toast.name, Toast)
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