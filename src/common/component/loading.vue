<template>
    <div class="app-loading">
        <div v-if="inSight" class="animation">
            <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="transparent" stroke="#e3e3e3" stroke-width="3" class="container"/>
                <!-- <circle cx="25" cy="50" r="8" fill="#e3e3e3" class="o-i-1"></circle> -->
                <!-- <circle cx="50" cy="50" r="6" fill="#e3e3e3" class="o-c-1"></circle> -->
                <circle cx="75" cy="50" r="6" fill="#e3e3e3" class="o-i-2"></circle>
                <circle cx="75" cy="50" r="6" fill="#e3e3e3" class="o-i-3"></circle>
                <circle cx="75" cy="50" r="4.5" fill="#e3e3e3" class="o-i-4"></circle>
                <circle cx="75" cy="50" r="4" fill="#e3e3e3" class="o-i-5"></circle>
            </svg>
        </div>
    </div>    
</template>
<script>
export default {
    name: 'loading',
    data () {
        return {
            inSight: true,
            delay: 100,
            timer: null
        }
    },
    methods: {
        show () {
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.inSight = true
            }, this.delay)
        },
        close () {
            this.inSight = false
            clearTimeout(this.timer)
            this.timer = null
        }
    }
}
</script>
<style lang="scss">
    .app-loading {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        .animation {
            // box-shadow: 0 0 50px 20px rgb(51,51,51);
            border-radius: 100%;
            font-size: 0; // fix inline-block
            & > svg {
                width: 60px;
                height: 60px;
                margin: auto;
                .container {
                    // stroke: rgba($color: #ffffff, $alpha: 0.8);
                    stroke-width: 0;
                    fill: rgba($color: #000000, $alpha: 0.5);
                }
                // & circle:nth-child(2) {
                .o-i-1 {
                    animation: circle-i1 2s infinite linear;
                }
                .o-c-1 {
                    animation: circle-i2 4s infinite linear;
                }
                .o-i-2 {
                    animation: circle-i1 2s infinite linear;
                }
                .o-i-3 {
                    animation: circle-i1 2s infinite linear;
                    animation-delay: .35s;
                }
                .o-i-4 {
                    animation: circle-i1 2s infinite linear;
                    animation-delay: .65s;
                }
                .o-i-5 {
                    animation: circle-i1 2s infinite linear;
                    animation-delay: .95s;
                }
            }
        }

        @keyframes circle-i1 {
            0% {
                transform: rotate(360deg) scale(1);
                transform-origin: 50px 50px;
            }
            75% {
                transform: rotate(150deg) scale(0.9);
                transform-origin: 50px 50px;
            }
            100% {
                transform: rotate(0deg) scale(1);
                transform-origin: 50px 50px;
            }
        }
        @keyframes circle-i2 {
            0% {
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 0;
            }
        }
        @keyframes circle-i3 {
            0% {
                transform: rotate(-360deg);
                transform-origin: 50px 50px;
            }
            50% {
                transform: rotate(0deg);
                transform-origin: 50px 50px;
            }
            100% {
                transform: rotate(-360deg);
                transform-origin: 50px 50px;
            }
        }
    }
</style>


