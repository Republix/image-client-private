<template>
    <transition name="modal-fade">
        <div class="app-modal">
            <div class="header">
                <span class="title">{{ title }}</span>
                <button class="icon icon-close"></button>
            </div>
            <div class="content"></div>
            <div class="action">
                <slot name="buttons"></slot>
            </div>
        </div>    
    </transition>
</template>
<script>
export default {
    name: 'modal',
    props: { 
        title: {
            type: String,
            required: true
        },
        styleStr: {
            type: String,
            required: false
        }
    }
}
</script>
<style lang="scss">
    @import '../scss/variables';

    .app-modal {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $app-modal-index;
    }

    .modal-fade-enter-active, .modal-fade-leave-active {
        transition-duration: .3s;
    }

    .modal-fade-enter, .modal-fade-leave-to {
        opacity: 0;
    }
</style>

