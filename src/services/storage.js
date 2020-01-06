class Storage {

    constructor (type) {

        this.set = function (key, value) {
            key = String(key)
            value = JSON.stringify(value)
            window[type].setItem(key, value)
        }

        this.get = function (key) {

            key = String(key)
            let result = window[type].getItem(key)

            try {
                result = JSON.parse(result)
            } catch (e) {}
            return result
        }

        this.remove = function (key) {
            key = String(key)
            window[type].removeItem(key)
        }
    }

}

export const SessionStorage = new Storage('sessionStorage')
export const LocalStorage = new Storage('localStorage')