const URI = {}

console.log(process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
    case 'development': {
        URI.BING = 'https://api.republix.cn/bing/'
        // URI.BING = 'http://127.0.0.1:9303/'
        break
    }
    case 'production': {
        URI.BING = 'https://api.republix.cn/bing/'
        break
    }
    default: {
        URI.BING = 'http://127.0.0.1:9303/'
        break
    }
}

export const BASE_URI = URI;

export const APP_CONFIG = {
    RIGHT_MENU: false
}