<template>
    <transition name="index-fade">
    <div class="index">
        <!-- 背景 -->
        <div class="bg-container">
            <div class="bg-image" :style="`background-image: url(${bgImageUrl})`"></div>
            <div class="bg-mask"></div>
        </div>

        <!-- info-card -->
        <div class="info-card">
            <div v-if="bgInfo.title" @click="changeInfoPreview"  class="title">{{ bgInfo.title }}</div>
            <div v-if="bgInfo.attribute" class="attribute">{{ bgInfo.attribute }}</div>
            <div class="copyright">{{ bgInfo.copyright }}</div>
            <!-- info preview -->
            <transition name="info-p-fade">
                <div v-if="infoPreview && bgInfo.para1" class="info-preview">
                    <div>{{ bgInfo.para1 }}</div>
                    <div>{{ bgInfo.para2 }}</div>
                </div>
            </transition>
        </div>

        <!-- 右上角工具栏 -->
        <div class="top-action">
            <button @click="menuDispatch('discover')" class="iconfont iconfont-discover-live btn"></button>
            <button @click="menuDispatch('more')" class="iconfont iconfont-more btn"></button>
        </div>

        <!-- mask -->
        <div class="bottom-mask"></div>

        <!-- action -->
        <div class="bottom-actions">
            <button @click="changeImage('pre')" class="iconfont iconfont-pre btn btn-pre"></button>
            <button @click="changeImage('next')" class="iconfont iconfont-next btn btn-next"></button>
        </div>

        <wp-tools v-if="moreMenu" 
            @action="menuDispatch"
            @like="likeHandler"
            @favor="favorHandler"
            :image="bgImageUrl"
            ></wp-tools>
    </div>
    </transition>
</template>

<script>

import request from '../services/request'

import WpTools from '../common/component/wp-tools.vue'

import {base64Img2Blob, requestFullScreen, cancelFullScreen, isFullScreen} from '../services/utils'
import {SET_CURRENT, CANCEL_INDEX, SET_INDEX, MARK, CANCEL_MARK} from '../vuex/mutationTypes'
import {INSERT_MARKS, DELETE_MARKS, CREATE_INDEX, REMOVE_INDEX, RECOVERY_INDEX, RECOVERY_MARKS} from '../vuex/actionTypes'
import {ROUTE_NAME_MAP} from '../routes'
import { mapState } from 'vuex';

const SAFE_STAMP = new Date(2019,0,10).getTime()

// function callbacks (v) {
//     console.log('jsonP', v)
// }
// window.callbacks = callbacks

export default {
    components: {
        WpTools
    },
    filters: {
        limitContent (value) {
            if (!value) return
            return value.substr(0, 50)
        }
    },
    data() {
        return {
            // bgImageUrl: '',
            now: '', // 当前时间 timeStamp格式
            offset: 0, // 偏移量
            targetTime: '', // 请求字段 yyyyMMdd
            timeStamp: new Date().getTime(), // 记录当前timeStamp以便计算
            bgInfo: {}, // 

            changeLock: false, // 是否锁住图片切换请求
            // 组件Lock
            moreMenu: true, // 右侧工具
            infoPreview: true, // 图片详细信息

        }
    },
    methods: {
        /**
         * @param {Number} id 图片id
         * @param {Boolean} set 是否执行set index操作
         */
        async setImageInfo (id) {
            this.changeLock = true
            let result = null
            try {
                result = await request.GetTodayImageInfo(id)
                result = JSON.parse(result.text)
            } catch (e) {
                this.changeLock = false
                return
            }

            // let bgImageUrl = result.imageUrl || 'https://cn.bing.com' + result.url
            let bgImageUrl = result.cdn || result.bgImageUrl
            
            await this.cacheImage(bgImageUrl)

            this.bgInfo = result
            // 设置状态
            this.$store.commit(SET_CURRENT, result)

            this.changeLock = false
        },

        /**
         * 缓存图片
         */
        cacheImage (src) {
            return new Promise((resolve, reject) => {
                let image = new Image()
                image.src = src
                image.onload = function () {
                    image = null
                    resolve(true)
                }
                image.onerror = function () {
                    image = null
                    resolve(false)
                }
            })
        },

        /**
         * @param {'pre'|'next'} action
         */
        changeImage (action) {
            // lock
            if (this.changeLock) return
            // 设置偏移量
            let offset = action === 'next' ?
                this.offset + 1 : action === 'pre' ?
                this.offset - 1 :
                0
            // 重设当前时间戳并更新目标值
            this.now = new Date().getTime()
            let _targetTime = this.now + offset * (24 * 3600 * 1000)
            
            // 限制
            if (_targetTime <= SAFE_STAMP) {
                // todo
                // showToast
                return
            }
            this.targetTime = _targetTime <= this.now ?
                        new Date(_targetTime).Format('yyyyMMdd') : 
                        new Date().Format('yyyyMMdd')

            if (_targetTime <= this.now ) {
                this.offset = offset
                this.targetTime = new Date(_targetTime).Format('yyyyMMdd')
                this.setImageInfo(this.targetTime)
            }
        },
        
        goToday () {
            this.changeImage()
        },
        /**
         * 图片下载
         */
        downloadImage (link) {
            let img = new Image

            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            img.crossOrigin = '' // Anonymous， 这里如果还报跨域错误，检查浏览器插件
            img.src = link

            img.onload = function () {

                canvas.width = this.width
                canvas.height = this.height

                context.drawImage(this, 0, 0)

                let tagA = document.createElement('a')
                let dataURL = canvas.toDataURL("image/jpg")
                tagA.href = URL.createObjectURL(base64Img2Blob(dataURL))

                tagA.download = 'download.png'
                const clickEvent = new MouseEvent('click')
                tagA.dispatchEvent(clickEvent)
                URL.revokeObjectURL(tagA.href)
            }
        },
        
        /**
         * 全屏
         */
        fullScreen () {
            if (!isFullScreen()) {
                requestFullScreen()
            } else {
                cancelFullScreen()
            }
        },

        /**
         * 浏览器中打开图片
         */
        creative () {
            const tagA = document.createElement('a')
            tagA.href = this.bgImageUrl
            const clickEvent = new MouseEvent('click')
            tagA.dispatchEvent(clickEvent)
        },

        /**
         * 键盘事件监听Handler
         */
        keyUpListener (e) {
            switch (e.code) {
                case 'ArrowLeft': 
                    this.changeImage('pre')
                    break
                case 'ArrowRight':
                    this.changeImage('next')
                    break
                default: 
                    break
            }
        },

        discover () {
            this.$router.push({ name: ROUTE_NAME_MAP.DISCOVER })
        },

        /**
         * 菜单触发事件派发
         */
        menuDispatch (type) {
            switch (type) {
                case 'discover':
                    this.discover()
                    break
                case 'today': 
                    this.goToday()
                    break
                case 'download':
                    this.bgImageUrl && this.downloadImage(this.bgImageUrl)
                    break
                case 'more':
                    this.moreMenu = !this.moreMenu
                    break
                case 'setting':
                    break
                case 'fullscreen':
                    this.fullScreen()
                    break
                case 'creative':
                    this.creative()
                    break
            }
        },

        /**
         * 详情预览开关
         */
        changeInfoPreview () {
            if (this.bgInfo && this.bgInfo.para1) {
                this.infoPreview = !this.infoPreview
            }
        },

        /**
         * 监听like事件
         * @param {Boolean} info
         * - false 取消事件
         */
        likeHandler (info) {
            if (!info) { // 执行
                // this.$store.commit(CANCEL_INDEX)
                this.$store.dispatch(REMOVE_INDEX)
                return
            }
            // this.$store.commit(SET_INDEX, this.bgInfo)
            this.$store.dispatch(CREATE_INDEX, this.bgInfo)
        },

        /**
         * 收藏处理
         */
        favorHandler ({ id, data }) {
            if (!id) { // 执行收藏
                // this.$store.commit(MARK, data)
                this.$store.dispatch(INSERT_MARKS, data)
            } else { // 有id，取消收藏
                // this.$store.commit(CANCEL_MARK, id)
                this.$store.dispatch(DELETE_MARKS, id)
            }
        },

        fixOffset() {
            if (!this.indexId) return 

            this.targetTime = this.indexId
            this.now = new Date().getTime()
            
            let year = this.indexId.substr(0, 4)
            let month = +this.indexId.substr(4, 2) - 1
            let day = this.indexId.substr(6, 2)
            
            let date = new Date(year, month, day).getTime()
            this.timeStamp = date
            this.offset = Math.ceil((date - this.now) / (24 * 3600 * 1000))

        }

    },

    /**
     * 挂载前查找本地数据
     */
    beforeMount () {
        this.$store.dispatch(RECOVERY_INDEX)
        this.$store.dispatch(RECOVERY_MARKS)
    },

    /**
     * 获取 主页||当日 数据
     * 初始化监听器
     */
    mounted () {

        // 获取图片
        this.setImageInfo(this.indexId)
        this.fixOffset()
        // 监听器初始化
        document.addEventListener('keyup', this.keyUpListener)


        // 
        // let newScript = document.createElement('script')
        // newScript.src = 'http://localhost:9303/jsonp'
        // document.body.appendChild(newScript)

    },

    beforeDestroy () {
        // 销毁监听器
        document.removeEventListener('keyup', this.keyUpListener)
    },

    computed: {
        indexId () {
            return this.$store.state.index.id || false
        },
        ...mapState({
            bgImageUrl: state => state.current.url
        })
    }

}
</script>
<style lang="scss"  type="text/scss" rel="stylesheet/scss">

    @import '../common/scss/variables';
    @import '../common/scss/mixin';

    .index {
        .bg-container {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-size: 100% 100%;
            transition-duration: .6s;
            .bg-image {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-size: cover;
                @include transition(.5s);
            }
        }

        .info-card {
            position: fixed;
            bottom: 50px;
            padding: 10px 20px;
            border-radius: 10px;
            color: #ffffff;
            font-size: 28px;
            max-width: 650px;
            text-shadow: 0 0 10px #333333;
            .title {
                position: relative;
                display: inline-block;
                font-size: inherit;
                margin-bottom: 10px;
                cursor: pointer;
                user-select: none;
                &::before {
                    content: '';
                    position: absolute;
                    transition-duration: .3s;
                    top: 0;
                    left: -8px;
                    width: 3px;
                    height: 0%;
                }
                &:hover {
                    &::before {
                        height: 100%;
                        background-color: $red;
                    }
                }
            }
            .attribute {
                margin-bottom: 10px;
                font-size: 22px;
            }
            .copyright {
                font-size: 22px;
            }

            .info-preview {
                $left: 5px;
                position: absolute;
                bottom: 100%;
                margin-bottom: 50px;
                left: $left;
                border: 2px solid rgba(255, 255, 255, 0.5);
                background-color: rgba(255, 255, 255, 0.15);
                padding: 10px 20px;
                border-radius: 3px;
                font-size: 20px;
                line-height: 1.6;
                max-width: 550px;
            }
        }

        .top-action {
            position: fixed;
            top: 12px;
            right: 25px;
            display: flex;
            flex-wrap: nowrap;
            padding: 10px 0;
            .btn {
                background-color: unset;
                background: transparent;
                border: none;
                font-size: 30px;
                color: rgba(255, 255, 255, 0.5);
                margin: 0 10px;
                cursor: pointer;
                user-select: none;
                outline: none;
                transition-duration: .3s;
                &:hover {
                    opacity: 1;
                    color: #ffffff;
                    text-shadow: 0 0 10px #ffffff;
                }
            }
        }

        .bottom-mask {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            box-shadow: 0px 0px 120px 55px #333333;
        }
        .bottom-actions {
            position: fixed;
            bottom: 0;
            right: 0;
            padding: 0 30px 20px 0;
            user-select: none;
            .btn {
                background-color: transparent;
                border: 0;
                color: #ffffff;
                font-size: 3em;
                @include transition(.3s);
                outline: none;
                user-select: none;
                cursor: pointer;
                border-radius: 100%;
                opacity: 0.5;
                &:hover {
                    opacity: 1;
                    text-shadow: 0px 0px 20px #e3e3e3;
                }
                &:active {
                    opacity: 1;
                    color: #000000;
                    text-shadow: 0px 0px 20px #000000;
                }
            }
            .btn-next {

            }
            .btn-pre {
            }
            .next {
                position: relative;
                width: 30px;
                height: 30px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 100%;
                border: none;
                outline: none;
                cursor: pointer;
                transition-duration: .3s;
                box-shadow: 0 0 10px 3px #e3e3e3;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.7);
                }
            }
        }

    }

    .info-p-fade-enter-active, .info-p-fade-leave-active {
        @include transition(.3s);
    }

    .info-p-fade-enter {
        opacity: 0;
        transform: translateY(50px);
    }

    .info-p-fade-leave-to {
        opacity: 0;
        transform: translateY(-50px);
    }

    .index-fade-leave-active, .index-fade-enter-acitve {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        @include transition(.15s);
        transform-origin: 50% 50%;
    }


    .index-fade-leave-to, .index-fade-enter {
        opacity: 0;
        transform: scale(1.3);
    }
</style>


