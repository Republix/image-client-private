<template>
    <transition name="_modal-fade">
        <div class="modal-entity">
            <div v-if="mask" class="modal-mask"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="title">{{ title }}</div>
                    <div class="close"><span>+</span></div>
                </div>
                <div class="modal-content">
                    {{ content }}
                </div>
                <div class="modal-action">
                    <button @click="cancelHandler" class="btn btn-cancel">取消</button>                    
                    <button @click="confirmHandler" class="btn btn-confirm">确认</button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: false
        },
        mask: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    methods: {
        confirmHandler () {
            this.$emit('confirm')
        },
        cancelHandler () {
            this.$emit('cancel')
        }
    }
}
</script>
<style lang="scss">
    .modal-entity {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        .modal-mask {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-container {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            background-color: #ffffff;
            border-radius: 5px;
            max-width: 600px;
            min-width: 300px;
            .modal-header {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 13px 12px;
                .title {
                    font-weight: 500;
                    font-size: 18px;
                }
                .close {
                    position: relative;
                    cursor: pointer;
                    user-select: none;
                    & > span {
                        font-size: 14px;
                        display: inline-block;
                        transform: rotate(45deg);
                    }
                    &::before {
                        content: '';
                        position: absolute;
                        width: 150%;
                        height: 100%;
                        transform: scale(2);
                    }
                }
            }
            .modal-content {
                box-sizing: border-box;
                padding: 20px 15px;
                border-top: 1px solid #dee2e6;
                border-bottom: 1px solid #dee2e6;
                font-size: 15px;
            }
            .modal-action {
                box-sizing: border-box;
                padding: 14px 15px;
                display: flex;
                justify-content: flex-end;
                .btn {
                    border: none;
                    border-radius: 3px;
                    outline: none;
                    user-select: none;
                    font-size: 13px;
                    padding: 4px 15px;
                    transition-duration: .3s;
                    cursor: pointer;
                }
                .btn-confirm {
                    background-color: #007bff;
                    color: #ffffff;
                    margin-left: 10px;
                    &:hover {
                        background-color: #0069d9;
                    }
                }
                .btn-cancel {
                    background-color: #6c757d;
                    color: #ffffff;
                    &:hover {
                        background-color: #5a6268;
                    }
                }
            }
        }
    }
</style>
