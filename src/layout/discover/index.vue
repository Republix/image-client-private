<template>
    <transition name="discover-fade">
    <div class="discover">
        <!-- 背景图 -->
        <div class="bg-container">
            <div class="filter-bg-img" :style="`background-image: url(${bgImgURL})`"></div>
        </div>
        <!--  -->
        <div class="top-bar">
            <div class="_left"></div>
            <div class="_center">
                <button @click="changeRouter('0')" class="btn"
                    :class="routerName === functionMap[0] ? 'active' : ''"
                ><i class="iconfont iconfont-discover"></i></button>
                <button @click="changeRouter('1')" class="btn"
                    :class="routerName === functionMap[1] ? 'active' : ''"
                ><i class="iconfont"
                    :class="routerName === functionMap[1] ? 'iconfont-favor-fill' : 'iconfont-favor'"
                ></i></button>
                <button @click="onDev()" class="btn"
                ><i class="iconfont iconfont-project"></i></button>
            </div>
            <div class="_right">
                <button @click="changeRouter('2')" class="btn-return"
                ><i class="iconfont iconfont-paper-airplane"></i></button>
            </div>
        </div>
        <!-- router-view -->
        <router-view class="content-view"></router-view>
    </div>
    </transition>
</template>

<script>

import {mapState} from 'vuex'

const MAP = ['BINGLIST', 'MARK', 'index']

export default {
    name: 'app-index',
    data() {
        return {
            functionMap: MAP,
        }
    },
    methods: {
        changeRouter (flag) {
            let routerName = this.functionMap[Number(flag)]
            this.$router.push({ name: routerName })
        },
        onDev () {
            let a = this.$toast('🕊', { duration: 1000 })
        },
        exitEventByKeyboard ({keyCode}) {
            try {
                keyCode === 27 && this.$router.back()
            } catch (e) {

            }
        },
    },
    computed: {
        ...mapState({
            bgImgURL: state => state.current.url
        }),
        routerName () {
            return this.$route.name
        }
    },
    mounted () {
        window.addEventListener('keyup', this.exitEventByKeyboard)
    },
    beforeDestroy () {
        window.removeEventListener('keyup', this.exitEventByKeyboard)
    }
}
</script>
<style lang="scss"  type="text/scss" rel="stylesheet/scss">

    @import '../../common/scss/variables';
    @import '../../common/scss/mixin';

    $default-bg-color: #000000;
    $top-bar-height: 75px;

    .discover {
        position: relative;
        min-height: 100vh;

        .bg-container {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: hidden;
            background-color: $default-bg-color;
            .filter-bg-img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                transform: translateX(-50%) translateY(-50%);
                background-size: cover;
                background-repeat: no-repeat;
                filter: blur(50px);
            }
        }

        .filter-bg-img {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-size: 100% 100%;

        }

        .top-bar {
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: $top-bar-height;
            background: rgba(255, 255, 255, 0.05);
            z-index: 2;
            ._left {
                min-width: 1px;
                max-width: 100px;
            }
            ._center {
                display: flex;
                align-items: flex-end;
                flex-wrap: nowrap;
                height: 100%;
                padding: 0 0 30px 0;
                .active {
                    i {
                        text-shadow: 0 0 10px #ffffff;
                    }
                }
                .btn {
                    border: 0;
                    outline: none;
                    user-select: none;
                    margin: 0 30px;
                    color: #ffffff;
                    font-size: 26px;
                    background-color: unset;
                    background: transparent;
                    cursor: pointer;
                    transition-duration: .3s;
                    i {
                        font-size: 26px;
                    }
                }
            }   
            ._right {
                position: absolute;
                top: 28px;
                right: 20px;
                .btn-return {
                    border: 0;
                    outline: none;
                    user-select: none;
                    margin: 0;
                    background-color: unset;
                    background: transparent;
                    cursor: pointer;
                    color: #ffffff;
                    transition-duration: .3s;
                    & > i {
                        font-size: 26px;
                    }
                    &:hover {
                        transform: rotate(-45deg);
                        text-shadow: 0 0 20px #ffffff;
                    }
                }
            }
        }

        .content-view {
            margin-top: $top-bar-height;
        }
    }

    .discover-fade-leave-active, .discover-fade-enter-acitve {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        @include transition(.2s);
        transform-origin: 50% 50%;
    }


    .discover-fade-leave-to, .discover-fade-enter {
        opacity: 0;
        transform: scale(0.8);
    }
</style>


