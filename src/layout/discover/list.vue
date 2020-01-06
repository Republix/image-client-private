<template>
    <transition name="normal-fade">
    <div class="bing-list" ref="scroll">
        <div class="_content">
            <div 
                v-for="(img, idx) in imageList"
                :key="idx"
                class="img-item">
                <template v-if="!img.loaded">
                    <div class="_loading"></div>
                </template>
                
                <div class="mask-view">
                    <div class="_title">{{img.title || img.copyright}}</div>
                    <div class="btn-group">
                        <i @click="creative(img.id)" class="iconfont iconfont-discover"></i>
                        <i @click="preview(img.full)" class="iconfont iconfont-preview ico-fix-1"></i>
                    </div>
                </div>
                <img :src="img.src" @load="img.loaded = true;" v-show="img.loaded" :alt="img.title || ''">
            </div>
        </div>

        <image-preview 
            v-if="showPreview && previewSrc" 
            :src="previewSrc"
            @close="closePreview"
            ></image-preview>
    </div>
    </transition>
</template>
<script>

/**
 * Todo
 * - 列表中图片加载时背景动画
 * - 列表flex布局添加元素后动画
 * - 主页侧边栏功能完善
 */

import request from '../../services/request'
import {CREATE_INDEX} from '../../vuex/actionTypes'
import { SET_INDEX } from '../../vuex/mutationTypes';
import {throttle, debounce} from '../../services/utils'
import ROUTER_NAME_MAP from '../../routeTypes'

import ImagePreview from '../../common/component/image-preview.vue'

const origin_resolution = '1920x1080'
const preview_resolution = '800x480'
const LOAD_VALVE = 200

export default {
    data() {
        return {
            imageList: [],
            pageSize: 10,
            pageNo: 1,
            container: null,

            refreshLock: false,
            showPreview: false,
            previewSrc: '',
            manualLoad: true, // 开启手动刷新

        }
    },
    methods: {
        getImageList (pageNo = this.pageNo, pageSize = this.pageSize) {
            if (this.refreshLock) return
            this.refreshLock = true
            request.GetBingImageList({pageNo, pageSize}).then((res) => {
                this.refreshLock = false
                let origin = JSON.parse(res.text)
                let newList = this.formatListData(origin)

                // 无数据时
                if (!newList || newList.length === 0) {
                    return
                }

                // preset
                newList = newList.map(i => {
                    i.loaded = false;
                    return i;
                })

                // 分页请求
                if (newList.length > 0) { // concat
                    this.pageNo = pageNo
                    this.imageList = this.imageList.concat(newList)
                    // 判断是否需要手动加载
                    this.$nextTick(() => {
                        let {scrollTop, scrollHeight, offsetHeight} = this.container
                        if (offsetHeight === scrollHeight || scrollHeight - offsetHeight < LOAD_VALVE) {
                            this.getImageList(pageNo + 1)
                        }
                    })
                    return
                }
                
                this.imageList = newList
            }).catch((e) => {
                this.refreshLock = false
            })
        },

        formatListData (origin) {
            return origin.map((elm) => {
                if (elm.imageUrl) {
                    elm.src = elm.imageUrl.replace(origin_resolution, preview_resolution)
                    elm.full = elm.cdn || elm.imageUrl
                } else {
                    elm.src = 'https://cn.bing.com' + elm.url.replace(origin_resolution, preview_resolution)
                    elm.full = 'https://cn.bing.com' + elm.url
                }

                return elm
            })
        },

        creative (id) {
            this.$router.push({ name: ROUTER_NAME_MAP.INDEX, query: { id } })
        },

        preview (src) {
            this.previewSrc = src
            this.showPreview = true
        },

        closePreview () {
            this.previewSrc = ''
            this.showPreview = false
        },

        setIndex (data) {
            this.$store.dispatch(CREATE_INDEX, data)
            this.$router.push({ name: 'index' })
        },

        initialScrollHandler () {
            this.container = this.$refs.scroll
            this.$refs.scroll.addEventListener('scroll', this.scrollHandler)
        },

        /**
         * 下拉滚动事件处理
         * - 分页
         * - 懒加载
         */
        // scrollHandler: throttle(function (e) {
        scrollHandler: debounce(function(e) { 
            let {scrollTop, scrollHeight, offsetHeight} = this.container
            if (scrollHeight - offsetHeight - scrollTop < LOAD_VALVE) {
                this.getImageList(this.pageNo + 1)
            }
            // console.log(this.container.scrollTop, this.container.scrollHeight, this.container.offsetHeight)
        }, 100),

        destoryScrollHandler () {
            this.$refs.scroll.removeEventListener('scroll', this.scrollHandler)
        }
    },
    mounted() {
        this.initialScrollHandler()
        this.getImageList(1, this.pageSize)
    },
    beforeRouteLeave (to, from, next) {
        // ...
        this.closePreview()
        next()
    },
    beforeDestroy () {
        this.destoryScrollHandler()
    },
    components: {
        ImagePreview,
    }
}
</script>
<style lang="scss">

    @import '../../common/scss/variables';
    @import '../../common/scss/mixin';

    .bing-list {
        position: relative;
        min-height: 100vh;
        height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
            width: 3px;
        }
        &::-webkit-scrollbar-track {
            width: 1px;
        }
        &::-webkit-scrollbar-track {
            width: 2px;
        }
        ._content {
            display: flex;
            // justify-content: flex-start;
            justify-content: center;
            flex-wrap: wrap;
            position: relative;
            padding-bottom: 100px;
            transition-duration: .3s;
            
            .img-item {
                position: relative;
                width: 400px;
                height: 240px;
                margin: 15px 20px;
                border-radius: 5px;
                @include transition(.3s);
                overflow: hidden;
                
                ._loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    // box-shadow: 0 0 10px #e3e3e3 inset;
                    background-color: rgba(255, 255, 255, 0.3);
                    // filter: blur(40px);
                    animation: img-loading 3s infinite linear;
                }

                .mask-view {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    @include transition(.3s);
                    ._title {
                        padding: 30px 30px 50px;
                        color: #999999;
                        word-wrap: break-all;
                        &::selection {
                            color: #999999;
                            background-color: #333333;
                        }
                    }
                    .btn-group {
                        position: absolute;
                        width: 100%;
                        bottom: 30px;
                        text-align: center;
                        i {
                            display: inline-block;
                            font-size: 26px;
                            color: #999999;
                            margin: 0 20px;
                            cursor: pointer;
                            @include transition(.3s);
                            &:hover {
                                color: #ffffff;
                            }
                        }
                        .ico-fix-1 {
                            font-size: 24px;
                        }
                    }
                }

                &:hover {

                    & > img {
                        transform: scale(1.05);
                    }
                    & .mask-view {
                        display: block;
                        z-index: 2;
                        animation: img-mask-fade .3s forwards;
                    }
                }
                
                & > img {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    animation: img-fade .3s ease;
                    @include transition(.3s);
                }
            }
            
            // &::after {
            //     content: '';
            //     flex: auto;
            // }
        }
    }

    @keyframes img-mask-fade {
        0% {
            background-color: rgba($color: #000000, $alpha: 0);
        }
        100% {
            background-color: rgba($color: #000000, $alpha: 0.6);
        }
    }

    @keyframes img-fade {
        0% {
            opacity: 0.2;
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes img-loading {
        0% {
            opacity: 0;
            filter: blur(10px);
        }
        50% {
            opacity: 1;
            filter: blur(30px);
            // background-color: rgba(255, 255, 255, 0.5);
        }
        100% {
            opacity: 0;
            filter: blur(10px);
        }
    }

    .normal-fade-enter-active, .normal-fade-leave-active {
        @include transition(.3s);
    }

    .normal-fade-enter, .normal-fade-leave-to {
        opacity: 0;
    }
</style>


