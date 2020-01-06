<template>
    <transition name="normal-fade">
    <div class="mark-list" ref="scroll">
        <div class="_content">
            <div v-for="(img, idx) in imageList"
                :key="idx"
                class="img-item" @click="preview(img.url)">
                <div class="mask-view"></div>
                <img :data-src="img.url" :alt="img.title || ''"  ref="imgList">
                <div class="img-title">{{ img.info.title || img.info.copyright }}</div>
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

// todo data-src

import {RECOVERY_MARKS} from '../../vuex/actionTypes'
import ImagePreview from '../../common/component/image-preview.vue'
import { mapState } from 'vuex'
import { throttle } from '../../services/utils';


export default {
    data() {
        return {
            showPreview: false,
            previewSrc: '',
        }
    },
    methods: {
        preview (src) {
            this.previewSrc = src
            this.showPreview = true
        },

        closePreview () {
            this.previewSrc = ''
            this.showPreview = false
        },

        delectVisiable () {
            let {clientHeight} = document.body
            this.$refs.imgList && this.$refs.imgList.forEach((elm) => {
                if (elm.getAttribute('src')) return
                let {y} = elm
                y - 200 < clientHeight && elm.setAttribute('src', elm.getAttribute('data-src'))
            })
        },

        scrollHandler: throttle(function () {
            this.delectVisiable()
        }, 100)
    },
    mounted() {
        this.delectVisiable()
        this.$refs.scroll.addEventListener('scroll', this.scrollHandler)
    },
    beforeRouteLeave (to, from, next) {
        this.closePreview()
        next()
    },
    components: {
        ImagePreview
    },
    created () {
        this.$store.dispatch(RECOVERY_MARKS)
    },
    beforeDestroy () {
        this.$refs.scroll.removeEventListener('scroll', this.scrollHandler)
    },
    computed: {
        ...mapState({
            imageList: state => state.marks
        })
    }
}
</script>
<style lang="scss">

    @import '../../common/scss/variables';
    @import '../../common/scss/mixin';

    .mark-list {
        position: relative;
        min-height: 100vh;
        padding-top: 20px;
        height: 0;
        overflow-y: auto;
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
            
            .img-item {
                position: relative;
                width: 400px;
                height: 240px;
                margin: 0px 20px;
                border-radius: 5px;
                @include transition(.3s);
                overflow: hidden;
                padding-bottom: 75px;

                .mask-view {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    @include transition(.3s);
                    cursor: pointer;
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
                    }

                }
                .img-title {
                    position: relative;
                    height: 40px;
                    overflow-y: auto;
                    color: #ffffff;
                    font-size: 15px;
                    transition-duration: .3s;
                }
                &:hover {
                    & > img {
                        transform: scale(1.05);
                    }
                    & .mask-view {
                        display: block;
                        z-index: 2;
                        // animation: img-mask-fade .3s forwards;
                    }
                    & .img-title {
                        transform: translateY(10px);
                    }
                }
                
                & > img {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    @include transition(.3s);
                }
            }
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

    .normal-fade-enter-active, .normal-fade-leave-active {
        @include transition(.3s);
    }

    .normal-fade-enter, .normal-fade-leave-to {
        opacity: 0;
    }
</style>


