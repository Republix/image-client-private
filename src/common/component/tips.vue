<template>
    <!-- 此处如果要用v-if 要注意tip.js中挂载顺序问题 -->
    <div v-show="open" class="app-tips">
        {{ content }}
    </div>
</template>
<script>
export default {
    data() {
        return {
            content: '',
            open: false
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
        right: -10px;
        bottom: -10px;
        @include box-sizing(border-box);
        padding: 4px 7px;
        @include border-radius(3px);
        background-color: #000000;
        color: #ffffff;
    }
</style>


