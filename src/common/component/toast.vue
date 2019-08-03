<template>
    <transition name="app-toast">
        <div v-if="inSight" class="app-toast" :class="closeBtn ? 'fix-close' : ''">
            <div class="toast-view">
                <i v-if="icon" :class="'iconfont iconfont-' + icon "></i>{{ message }}
                <button v-if="closeBtn" class="iconfont iconfont-close close-btn"></button></div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'app-toast',
    data () {
        return {
            message: '',
            duration: '',
            icon: '',
            type: '',
            closeBtn: false,
            timer: null,
            inSight: true,
        }
    },
    methods: {
        show () {
            this.inSight = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.close()
            }, this.duration)
        },
        close () {
            clearTimeout(this.timer)
            this.timer = null
            this.inSight = false
        },

    }
}
</script>
<style lang="scss">

    $background: rgba($color: #000000, $alpha: 0.8);
    $message-color: #ffffff;
    $toast-index: 1000;

    .app-toast {
        position: fixed;
        top: 45%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: inline-block;
        z-index: $toast-index;
        .toast-view {
            position: relative;
            box-sizing: border-box;
            background: $background;
            color: $message-color;
            padding: 8px 20px;
            border-radius: 7px;
            font-size: 15px;
            box-shadow: 0 1px 4px 0.5px #000000;
            user-select: none;
            .close-btn {
                position: absolute;
                top: 4px;
                right: 0px;
                outline: none;
                user-select: none;
                border-radius: 100%;
                border: 0;
                background: transparent;
                cursor: pointer;
                color: $message-color;
                font-size: 12px;
                transition-duration: .3s;
                &:hover {
                    font-weight: bold;
                }
            }
        }
        .fix-close {
            padding: 10px 22px 9px 20px;
        }
    }
    .app-toast-enter-active, .app-toast-leave-active {
        transition: .3s;
    }

    .app-toast-leave-to {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
    }
    .app-toast-enter {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
    }
</style>


