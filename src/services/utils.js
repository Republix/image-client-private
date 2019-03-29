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
    let cacheElm = document.documentElement
    let cancelFull = cacheElm.cancelFullScreen || cacheElm.webkitCancelFullScreen || cacheElm.mozCancelFullScreen || cacheElm.exitFullScreen

    cancelFull && cancelFull.call(cacheElm)

}

export function isFullScreen () {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
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
        if (_nowTime - _lastTime >= gap) {
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
        clearTimeout(timer)
        timer = setTimeout(function() {
            func.apply(context, args)
        }, delay)
    }
}