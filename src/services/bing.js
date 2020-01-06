export function testDate (str) {
    let first = /^\d{8}$/.test(str)
    if (!first) return false

    try {
        let year = str.substr(0, 4)
        let month = +str.substr(4, 2) - 1
        let day = str.substr(6, 2)
        return new Date(year, month, day).getTime() > 0
    } catch (e) {
        return false
    }
}