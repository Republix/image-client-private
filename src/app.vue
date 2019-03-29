<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        confirm () {
            // this.$confirm('test', 'content').then((res) => {
            //     console.log(res)
            // })
        }
    },
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


