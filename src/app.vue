<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>

<script>

import {RECOVERY_CONFIG} from './vuex/actionTypes'

export default {
    beforeMount () {
        this.$store.dispatch(RECOVERY_CONFIG)
    }
}
</script>

<style lang="scss"  type="text/scss" rel="stylesheet/scss">

    @import './common/scss/variables';

    body {
        margin: 0;
        overflow: hidden;
    }
    .app {
        position: relative;
        width: 100%;
        min-height: 480px;
    }
</style>


