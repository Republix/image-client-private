<template>
    <transition name="image-preview-fade">
    <div class="image-preview">
        <div v-if="mask" 
            @click="close"
            class="_mask"></div>
        <div class="image">
            <img :src="src" 
                @click.stop="close"
                :alt="alt">
        </div>
    </div>
    </transition>
</template>
<script>
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
        }
    },
    methods: {
        close () {
            this.$emit('close')
        }
    },
    mounted () {

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
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            width: 65vw;
            height: 39vw;
            border-radius: 10px;
            border: 3px solid #ffffff;
            & > img {
                width: 100%;
                height: 100%;
                border-radius: 10px;
            }
        }
    }

    .image-preview-fade-enter-active, .image-preview-fade-leave-active {
        transition: .3s;
    }

    .image-preview-fade-leave-to, .image-preview-fade-enter {
        opacity: 0;
    }
</style>


