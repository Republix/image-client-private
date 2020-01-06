const path = require('path')
const fs = require('fs')

/**
 * 
 * @param {String} folderPath - 文件或文件夹位置
 * @param {*} unlinkDir - 是否要删除改文件夹
 */
function unlink (folderPath, unlinkDir) {
        
    let folderExists = fs.existsSync(folderPath)
    if (!folderExists) return console.log(`[cleanFolder] [Error] 删除文件失败，目录不存在: ${folderPath}`)

    let files = fs.readdirSync(folderPath)
    if (unlinkDir !== true && files.length === 0) return console.log(`[cleanFolder] [Info] 执行目录为空`)
    
    try {
        files.forEach((name) => {
            let filePath = path.join(folderPath, name)

            if (fs.statSync(filePath).isDirectory()) {

                unlink(filePath, true)
            } else {
                fs.unlinkSync(filePath)
            }
        })
        unlinkDir === true && fs.rmdirSync(folderPath)
    } catch (e) {
        console.log(`[cleanFolder] [Error]`, e)
    }
}

function cleanFolder () {
    unlink(...arguments)
    console.log('#cleanFolderFinish', arguments[0])
}

module.exports = {
    cleanFolder
}
