import {APP_CONFIG} from '../config';

import {
    SET_INDEX,
    CANCEL_INDEX,
    SET_CURRENT,
    MARK,
    CANCEL_MARK,
    OVERWRITE_MARK,
    SET_ADMIN,
    CLEAR_ADMIN,
    UPDATE_CONFIG
} from './mutationTypes'

import {
    CREATE_INDEX,
    REMOVE_INDEX,
    INSERT_MARKS,
    DELETE_MARKS,
    RECOVERY_MARKS,
    CLEAR_IMAGE,
    // ADMIN_LOGIN,
    // ADMIN_LOGOFF,
    RECOVERY_INDEX,
    SET_CONFIG,
    RECOVERY_CONFIG
} from './actionTypes'

import {LocalStorage} from '../services/storage'

export default {
    state: {
        domain: 'localhost',
        index: {
            id: '',
            url: '',
            info: {}
        },
        current: {
            id: '',
            url: '',
            info: {}
        },
        marks: [],
        admin: {
            id: '',
            name: '',
            token: '',
            loginDate: ''
        },
        config: {
            menu: APP_CONFIG.RIGHT_MENU
        }
    },
    getters: {
        indexId (state) {
            return state.index.id
        }
    },
    mutations: {
        /**
         * 设置选中数据
         * @param {*} data 
         */
        [SET_INDEX] (state, data) {
            state.index.id = data.id
            state.index.url = data.cdn || data.imageUrl
            state.index.info = data
        },

        /**
         * 取消收藏
         */
        [CANCEL_INDEX] (state) {
            state.index.id = ''
            state.index.url = ''
            state.index.info = {}
        },
        
        /**
         * 当前图片信息
         * @param {*} data 
         */
        [SET_CURRENT] (state, data) {
            state.current.id = data.id
            state.current.url = data.cdn || data.imageUrl
            state.current.info = data
        },

        [MARK] (state, data) {
            if (!data || !data.id) 
                return
            state.marks.findIndex(elm => {
                return elm.id === data.id
            }) === -1 && state.marks.push(data)
        },

        [CANCEL_MARK] (state, id) {
            if (!id) 
                return
            state.marks.findIndex((elm, idx) => {
                if (elm.id === id) {
                    state.marks.splice(idx, 1)
                    return true
                }
            })
        },

        [OVERWRITE_MARK] (state, data) {
            data = data || []
            state.marks = data
        },

        /**
         * 设置管理员信息
         * @param {*} param1 
         */
        [SET_ADMIN] (state, {id, loginDate, token, name}) {
            state.admin.id = id
            state.admin.loginDate = loginDate
            state.admin.token = token
            state.admin.name = name
        },

        /**
         * 清除管理员信息
         */
        [CLEAR_ADMIN] (state) {
            state.admin.id = ''
            state.admin.loginDate = ''
            state.admin.token = ''
            state.admin.name = ''
        },

        /**
         * 更新配置
         */
        [UPDATE_CONFIG] (state, {menu}) {
            if (menu !== undefined) {
                state.config.menu = menu
            }
        }
    },
    actions: {
        [CREATE_INDEX] ({commit}, data) {
            LocalStorage.set('index_img', data)
            commit(SET_INDEX, data)
        },

        [REMOVE_INDEX] ({commit}) {
            LocalStorage.set('index_img', '')
            commit(CANCEL_INDEX)
        },

        [RECOVERY_INDEX] ({commit}) {
            let data = LocalStorage.get('index_img')
            data && commit(SET_INDEX, data)
        },

        /**
         * 更新收藏
         * @param {*} data 
         */
        [INSERT_MARKS] ({commit, state}, data) {
            commit(MARK, data)
            LocalStorage.set('mark_img', state.marks)
        },

        [DELETE_MARKS] ({commit, state}, id) {
            commit(CANCEL_MARK, id)
            LocalStorage.set('mark_img', state.marks)
        },

        [RECOVERY_MARKS] ({commit, state}) {
            let data = LocalStorage.get('mark_img')
            commit(OVERWRITE_MARK, data)
        },

        [CLEAR_IMAGE] ({commit, state, dispatch}) {
            commit(CANCEL_INDEX)
            commit(CANCEL_MARK)
            LocalStorage.remove('index_img')
            LocalStorage.remove('mark_img')
        },

        // [ADMIN_LOGIN] ({commit, state, dispatch}) {

        // },
        // [ADMIN_LOGOFF] ({commit, state, dispatch}) {

        // }
        [SET_CONFIG] ({commit, state}, {menu}) {
            let copyConfig = {...state.config}
            if (menu !== undefined) {
                copyConfig.menu = menu
            }
            commit(UPDATE_CONFIG, copyConfig)
            LocalStorage.set("app_config", copyConfig)
        },

        [RECOVERY_CONFIG] ({commit}) {
            let appConfig = LocalStorage.get("app_config")
            appConfig && commit(UPDATE_CONFIG, appConfig)
        }
    }
}