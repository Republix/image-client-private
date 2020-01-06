/**
 * base64 转 Blob
 * @param {*} code 
 */

export function base64Img2Blob (code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

/**
 * 是否为IE
 */
function isIE () {
    return window.hasOwnProperty('ActiveXObject')
}


/**
 * 请求全屏
 */
export function requestFullScreen() {
    // IE
    if (isIE()) {
        let wScript = new ActiveXObject("WScript.Shell")
        wScript && wScript.SendKeys("{F11}")
        return
    }
    // normal browser
    let cacheElm = document.documentElement
    let reqFull = cacheElm.requestFullScreen || cacheElm.webkitRequestFullScreen || cacheElm.mozRequestFullScreen || cacheElm.msRequestFullScreen
    
    reqFull && reqFull.call(cacheElm)
}

/**
 * 取消全屏
 */
export function cancelFullScreen () {
    if (isIE()) {
        let wScript = new ActiveXObject("WScript.Shell")
        wScript && wScript.SendKeys("{F11}")
        return
    }
    let cacheElm = document;
    let cancelFull = cacheElm.cancelFullScreen || cacheElm.webkitCancelFullScreen || cacheElm.mozCancelFullScreen || cacheElm.exitFullScreen
    cancelFull && cancelFull.call(cacheElm)

}

export function isFullScreen () {
    return document.isFullScreen || document.mozFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
}

// 这种不能解构
// export default {
//     base64Img2Blob,
//     requestFullScreen,
//     cancelFullScreen
// }


export function throttle (func, gap = 100) {
    let _lastTime = 0
        
    return function () { // A
        let _nowTime = + new Date() //  快捷转换为Number类型数据
        if (_nowTime - _lastTime >= gap || _lastTime === 0) {
            func.apply(this, arguments)
            _lastTime = _nowTime
        }
    }
}

export function debounce (func, delay = 100) {
    let timer = null

    return function() {
        let context = this,
            args = arguments
        timer = setTimeout(function() {
            timer && clearTimeout(timer)
            func.apply(context, args)
        }, delay)
    }
}

/**
 * 缓存图片
 * @param {String} src 
 * @return Promise
 */
export function cacheImage (src) {
    return new Promise((resolve) => {
        let image = new Image()
        image.src = src
        image.onload = function () {
            image = null
            resolve(true)
        }
        image.onerror = function () {
            image = null
            resolve(false)
        }
    })
}

/**
 * 下载图片
 * @param {String} link 下载链接
 * @param {String} name 下载文件名称
 * @param {String} crossOrigin 跨预选项
 */
export function downloadImage (link, name = 'download', crossOrigin = '') {
    return new Promise((resolve) => {
        let image = new Image
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        image.crossOrigin = crossOrigin
        image.src = link

        image.onload = function () {
            canvas.width = this.width
            canvas.height = this.height

            context.drawImage(this, 0, 0)

            let tagA = document.createElement('a')
            let dataURL = canvas.toDataURL('image/jpg')
            tagA.href = URL.createObjectURL(base64Img2Blob(dataURL))
            tagA.download = (name || 'download') + '.png'
            const clickEvent = new MouseEvent('click')
            tagA.dispatchEvent(clickEvent)
            URL.revokeObjectURL(tagA.href)
            resolve(true)
            image = null
            tagA = null
        }

        image.onerror = function () {
            resolve(false)
        }
    })
    
}

/**
 * 在浏览器中显示图片
 * @param {String} link 
 * @param {String} target 
 */
export function viewImageInBrowser (link, target = '') {
    let tagA = document.createElement('a')
    tagA.href = link
    tagA.target = target
    const clickEvent = new MouseEvent('click')
    tagA.dispatchEvent(clickEvent)
    tagA = null
}