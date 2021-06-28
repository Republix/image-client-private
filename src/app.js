
import './common/scss/index.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import rootStore from './vuex/rootScope';
import Plugins from './common/plugins'
import {routes} from './routes'


const DEV_MODE = Boolean(process.env.NODE_ENV === 'development')


if (DEV_MODE) {
  Vue.config.devtools = true
  Vue.config.productionTip = true
}


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Plugins);

const store = new Vuex.Store(rootStore)

const router = new VueRouter({
  mode: 'history', 
  routes: routes.base
})

export default new Vue({
  el: '#app',
  render: h => (<router-view></router-view>),
  store,
  router
})