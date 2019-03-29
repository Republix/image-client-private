
import './common/scss/index.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import rootStore from './vuex/rootScope';
import Plugins from './common/plugins'
import {routes} from './routes'


const DEV_MODE = Boolean(process.env.NODE_ENV === 'development')


if (DEV_MODE) {
    Vue.config.devtools = true;
    Vue.config.productionTip = true; // ?show 'U are running Vue in developemnt mode'
}



Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Plugins);

const store = new Vuex.Store(rootStore)
// { modules: { } }

const router = new VueRouter({
    // base: '/',
    mode: 'history', // todo note 这里需要配合 webpack-dev-server 的 historyApiFallback: true 
    // mode: 'hash', // history or hash
    routes: routes.base
})

/**
 * mounted && start
 */
const app = new Vue({
    el: '#app',
    render: h => (<router-view></router-view>),
    store,
    router
})