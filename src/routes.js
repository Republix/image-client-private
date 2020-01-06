const app = () => import('./app.vue')
// const index = () => import(/* webpackChunkName: "index" */'./layout/index.vue')
const index = () => import('./layout/index.vue')
const discover = () => import('./layout/discover/index.vue')

const mark = () => import('./layout/discover/mark.vue')
const bingList = () => import('./layout/discover/list.vue')
const collage = () => import('./layout/discover/collage.vue')

import NAME_MAP from './routeTypes'


const ROUTES = {
    base: [
        {
            path: '/',
            name: NAME_MAP.APP,
            meta: { name: 'app' },
            component: app,
            redirect: '/index',
            children: [
                {
                    path: 'index',
                    name: NAME_MAP.INDEX,
                    meta: { name: 'index' },
                    component: index
                },
                {
                    path: 'discover',
                    name: NAME_MAP.DISCOVER,
                    meta: { name: 'discover' },
                    redirect: '/discover/list',
                    component: discover,
                    children: [
                        {
                            path: 'list',
                            name: NAME_MAP.BING_LIST,
                            component: bingList,
                            meta: { name: 'list' }
                        },
                        {
                            path: 'mark',
                            name: NAME_MAP.MARK,
                            component: mark,
                            meta: { name: 'mark' }
                        },
                        {
                            path: 'collage',
                            name: NAME_MAP.COLLAGE,
                            component: collage,
                            meta: { name: 'collage' }
                        }
                    ]
                }
            ]
        },
    ]
}



export const routes = ROUTES