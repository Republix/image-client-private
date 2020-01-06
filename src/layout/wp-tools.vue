<template>
    <transition name="wp-tools-fade">
        <div :class="['wp-tools', theme || '']">
            <!-- <button @click="menuHandler('today')" 
                v-tips.left="'today'"
                class="iconfont iconfont-discover btn"></button> -->
            <template v-if="image">
                <button @click="likeHandler()" 
                    class="iconfont btn"
                    :class="likeId === currentId ? 'iconfont-like-fill' : 'iconfont-like'"
                ></button>

                <button @click="menuHandler('download')" 
                    v-tips.left="'下载'"
                    class="iconfont iconfont-download btn"></button>
                <button @click="menuHandler('fullscreen')" 
                    v-tips.left="'全屏'"
                    class="iconfont iconfont-fullscreen btn"></button>
                <button @click="menuHandler('viewInNewTab')" 
                    v-tips.left="'新标签页'"
                    class="iconfont iconfont-creative btn"></button>

                <button @click="favorHandler()" 
                    class="iconfont btn"
                    :class="marked ? 'iconfont-favor-fill' : 'iconfont-favor'"
                ></button>
            </template>
        </div>
    </transition>
</template>
<script>

import {mapState} from 'vuex'

export default {
    props: {
        theme: '',
    },
    methods: {
        menuHandler (type) {
            this.$emit('action', type)
        },

        likeHandler () {
            let result = this.likeId === this.currentId ? // 现在是like 状态
                false : 
                this.current
                
            this.$emit('like', result)
        },

        favorHandler () {
            let result = this.marked ?
                { mark: false, id: this.currentId } : // 取消收藏
                { mark: true, data: Object.assign({}, this.current) } // 执行收藏

            this.$emit('favor', result)
        }
    },
    computed: {
        ...mapState({
            image: state => state.current.url,
            currentId: state => state.current.id,
            current: state => state.current,
            likeId: state => state.index.id,
            like: state => state.index,
            marked: (state) => {
                return state.marks.findIndex((elm) => {
                    return elm.id === state.current.id
                }) > -1
            }
        })
    }
}
</script>
<style lang="scss">

    @import '../common/scss/variables';
    @import '../common/scss/mixin';

    $bg-color: rgba(0, 0, 0, 0.35);
    $bg-color-hover: rgba(0, 0, 0 ,0.65);

    .wp-tools {
        position: fixed;
        top: 50%;
        right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: $bg-color;
        border-radius: 6px;
        padding: 10px 15px;
        box-shadow: 0 0 50px 0px $bg-color;
        @include transform(translateY(-50%));
        @include transition(.5s);
        &:hover {
            background-color: $bg-color-hover;
        }

        .btn {
            background-color: unset;
            background: transparent;
            border: none;
            font-size: 30px;
            color: rgba(255, 255, 255, 0.5);
            margin: 10px 0;
            padding: 0 3px;
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

    .wp-tools-fade-enter-active, .wp-tools-fade-leave-active {
        transition-duration: .3s;
    }

    .wp-tools-fade-enter {
        opacity: 0;
        right: 0;
    }

    .wp-tools-fade-leave-to {
        opacity: 0;
        right: 0;
    }


</style>


