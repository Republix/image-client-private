const path = require('path')
const fs = require('fs')
const { buildConfig: { distPath } } = require('./app.config')

/**
 * 
 * @param {String} folderPath - 文件或文件夹位置
 * @param {*} unlinkDir - 是否要删除改文件夹
 */
function unlink (folderPath, unlinkDir = false) {
        
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

/**
 * 删除打包文件夹
 */
function cleanDistFolder () {
  console.info('清空打包文件夹', distPath)
  unlink(distPath, false)
}


module.exports = {
  cleanDistFolder
}
