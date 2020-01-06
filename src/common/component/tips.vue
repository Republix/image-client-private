<template>
    <!-- 此处如果要用v-if 要注意tip.js中挂载顺序问题 -->
    <transition name="tips-fade">
        <div 
            v-show="open" 
            class="app-tips"
            :class="direction === 'left' || direction === 'right' ? 'app-tips-vertical-center' : ''"
        >{{ content }}</div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            content: '',
            open: false,
            direction: ''
        }
    },
    methods: {
        show () {
            this.open = true
        },
        leave () {
            this.open = false
        }
    }
}
</script>
<style lang="scss">

    @import '../scss/mixin.scss';
    @import '../scss/variables.scss';

    .app-tips {
        position: absolute;
        display: inline-block;
        @include box-sizing(border-box);
        padding: 5px 0.8rem;
        @include border-radius(5px);
        background-color: #000000;
        color: #ffffff;
        font-size: 1rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .app-tips-vertical-center {
        @include transform(translateY(-50%));
    }

    .tips-fade-enter-active, .tips-fade-leave-active {
        @include transition(.3s);
    }

    .tips-fade-enter, .tips-fade-leave-to {
        opacity: 0;
    }
</style>


