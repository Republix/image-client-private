const app = () => import('./app.vue')
// const index = () => import(/* webpackChunkName: "index" */'./layout/index.vue')
// const discover = () => import(/* webpackChunkName: "dis" */'./layout/discover.vue')
const index = () => import('./layout/index.vue')
const discover = () => import('./layout/discover.vue')

const mark = () => import('./layout/side/mark.vue')
const bingList = () => import('./layout/side/list.vue')
const collage = () => import('./layout/side/collage.vue')


const NAME_MAP = {
    APP: 'app',
    INDEX: 'index',
    DISCOVER: 'discover',
    MARK: 'MARK',
    COLLAGE: 'COLLAGE',
    BING_LIST: 'BINGLIST'
}

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
export const ROUTE_NAME_MAP = NAME_MAP