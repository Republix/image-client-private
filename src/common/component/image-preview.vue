<template>
    <transition name="image-preview-fade">
    <div class="image-preview">
        <div v-if="mask" 
            @click="close"
            class="_mask"></div>
        <div class="image" 
            ref="image"
            :style="width && height ? `width: ${width}px;height: ${height}px;top: ${cY}px; left: ${cX}px;` : (`top: ${cY}px; left: ${cX}px;`)"
            @drag="dragHandler"
            @dragstart="dragStartHandler"
            @dragend="dragEndHandler"
            draggable
            @dblclick="resetImgLocation"
            :class="{'animation': animation}"
        >
            <img :src="src" :alt="alt" draggable="false">
            <div v-if="status !== 1" :class="status === 0 ? 'img-loading' : status === 2 ? 'img-failed' : '' "></div>
        </div>
    </div>
    </transition>
</template>
<script>

import { throttle, debounce } from '../../services/utils'
import { setTimeout } from 'timers';

let dragCount = 0

const MIN_SCALE = -15
const MAX_SCALE = 50

const RADIO_X = 0.65
const RADIO_Y = 0.39

export default {
    props: {
        src: {
            required: true
        },
        alt: '',
        mask: {
            required: false,
            default: true,
            type: Boolean
        },
        scope: {
            default: 1.25,
            type: Number,
        },
        dragable: {
            default: true,
            type: Boolean
        }
    },
    data () {
        return {
            // 放大参数
            offset: 0, // 放大倍数
            origin_width: '', // 原始宽度
            origin_height: '', // 原始高度
            width: null,
            height: null,
            // 移动参数
            start_cX: null, // 原始位置 x
            start_cY: null, // 原始位置 y
            cX: null,
            cY: null,

            animation: true,

            dom: null,
            status: 0, // 0 加载图片中， 1 加载完成， 2 加载失败 
        }
    },
    methods: {
        close () {
            this.$emit('close')
        },

        wheelListener: throttle(function ({deltaY}) {
            let direction = deltaY > 0 ?
                'down' : deltaY < 0 ?
                'up' : 'none'
            this.wheelHandler(direction)
        }, 50),

        wheelHandler (direction) {
            direction === 'down' && this.reduced()
            direction === 'up' && this.zoom()
        },

        /**
         * 缩小窗口
         */
        reduced () {
            if ((this.offset - 1) <= MIN_SCALE) {
                return;
            }

            if (!this.width && !this.height) {
                this.width = this.origin_width
                this.height = this.origin_height
            }
            this.offset = this.offset - 1
            let _width = this.width / this.scope
            let _height = this.height / this.scope
            let {x, y} = this.dom.getBoundingClientRect()
            this.cX = x - (_width - this.width) / 2
            this.cY = y - (_height - this.height) / 2
            this.width = _width
            this.height = _height
        },

        /**
         * 放大窗口
         */
        zoom () {
            if ((this.offset + 1) >= MAX_SCALE) {
                return;
            }
            if (!this.width && !this.height) {
                this.width = this.origin_width
                this.height = this.origin_height
            }
            this.offset = this.offset + 1
            let new_width = this.width * this.scope
            let new_height = this.height * this.scope
            let {x, y} = this.dom.getBoundingClientRect()
            this.cX = x - (new_width - this.width) / 2
            this.cY = y - (new_height - this.height) / 2
            this.width = new_width
            this.height = new_height
        },

        dragStartHandler (e) {
            // e.dataTransfer.dropEffect = 'move'

            let clientX = e.clientX
            let clientY = e.clientY
            this.start_cX = +clientX.toFixed(0)
            this.start_cY = +clientY.toFixed(0)
            
             let img = document.createElement('img') 
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' 
            e.dataTransfer.setDragImage(img, 0, 0) 
        },

        /**
         * clientX, Y 鼠标在浏览器中的位置
         * layerX, Y 鼠标在dom中的位置
         */
        dragHandler: throttle(function (e) {
            if (dragCount === 0) {
                return dragCount = 1
            }
            this.animation = false;

            let clientX = e.clientX || e.originalTarget && e.originalTarget.clientX
            let clientY = e.clientY || e.originalTarget && e.originalTarget.clinetY

            if (!clientX && !clientY) return
            if (clientX === this.start_cX && clientY === this.start_cY) return

            let {x, y} = this.dom.getBoundingClientRect()
            clientX = +clientX.toFixed(0)
            clientY = +clientY.toFixed(0)

            let _cx = x + clientX - this.start_cX
            let _cy = y + clientY - this.start_cY

            if (this.start_cX !== clientX) {
                this.start_cX = clientX
                Object.freeze(this.start_cX);
                this.cX = _cx
            }
            if (this.start_cY !== clientY) {
                this.start_cY = clientY
                Object.freeze(this.start_cY);
                this.cY = _cy
            }
            dragCount += 1
        }, 10),

        dragEndHandler () {
            dragCount = 0
            this.animation = true;
        },

        keyUpListener (e) {
            e.stopPropagation()
            
            let {keyCode} = e
            switch (keyCode) {
                case 27:
                    this.close()
                    break
                default:
                    break
            }
        },

        windowResizeListener: debounce(function (e) {
            let {width, height} = document.body.getBoundingClientRect()

            this.origin_width = width
            this.origin_height = height
        }, 100),

        preDownloadImg () {
            let image = new Image()
            image.src = this.src
            image.onload = () => {
                this.status = 1
                image = null
            }
            image.onerror = () => {
                this.status = 2            
                image = null
            }
        },

        resetImgLocation () {

            let bodyRect = document.body.getBoundingClientRect()
            let b_width = bodyRect.width
            let b_height = bodyRect.height

            this.width = b_width * RADIO_X
            this.height = b_width * RADIO_Y
            

            this.cX = Math.abs(b_width / 2 - this.width / 2)
            this.cY = Math.abs(b_height / 2 - this.height / 2)

            this.offset = 0
        },

        registerListeners () {
            this.$refs.image.addEventListener('mousewheel', this.wheelListener)

            document.addEventListener('keyup', this.keyUpListener)

            window.addEventListener('resize', this.windowResizeListener)
        },

        destoryListeners () {
            this.$refs.image.removeEventListener('mousewheel', this.wheelListener)

            document.removeEventListener('keyup', this.keyUpListener)

            window.removeEventListener('resize', this.windowResizeListener)
        }
    },

    created () {
        this.preDownloadImg();
    },

    /**
     * 初始化关键变量
     * 初始化监听器
     * cache dom
     */
    mounted () {
        // key params
        this.dom = this.$refs.image

        let {width, height} = this.dom.getBoundingClientRect()
        let bodyRect = document.body.getBoundingClientRect()
        let b_width = bodyRect.width
        let b_height = bodyRect.height

        this.origin_width = width
        this.origin_height = height

        this.width = b_width * RADIO_X
        this.height = b_width * RADIO_Y

        this.cX = Math.abs(b_width / 2 - width / 2)
        this.cY = Math.abs(b_height / 2 - height / 2)

        // register listener
        this.registerListeners()
    },
    beforeDestroy () {
        this.destoryListeners()
    }
}
</script>
<style lang="scss">

    .image-preview {
        position: fixed;
        z-index: 10;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        ._mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
        }
        .image {
            position: absolute;
            width: 65vw;
            height: 39vw;
            cursor: move;
            & > img {
                position: relative;
                width: 100%;
                height: 100%;
                z-index: 1;
                border-radius: 10px;
                border: 3px solid #ffffff;
            }
            .img-loading {
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #ffffff;
                    animation: imgloading 4s infinite;
                }
            }
            .img-failed {
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #ffffff;
                    animation: imgloading 1s infinite;
                }
            }
            .stop {
                // content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        .animation {
            transition-duration: .1s;
        }
    }

    @keyframes imgloading {
        0% {
            opacity: 0;
            filter: blur(10px);
        }
        60% {
            opacity: 0.5;
            filter: blur(40px);
        }
        100% {
            opacity: 0;
            filter: blur(10px);
        }

    }

    .image-preview-fade-enter-active, .image-preview-fade-leave-active {
        transition: .3s;
    }

    .image-preview-fade-leave-to, .image-preview-fade-enter {
        opacity: 0;
    }
</style>


