// post等请求body内数据解析
const bodyParser = require('koa-bodyparser')
// 静态文件
const path = require('path')
const staticFiles = require('koa-static')
// jwt相关
const jwtKoa = require('koa-jwt')
const secret = require('../config/secret.json')
// 响应数据的格式化
const miSend = require('./mi-send')
// 日志
const miLog = require('./mi-log')
module.exports = (app) => {
  app
    .use(jwtKoa({secret:secret.sign}).unless({
      path: ['/login','/register'] //数组中的路径不用通过认证
    }))
    .use(staticFiles(path.resolve(__dirname, "../public")))
    .use(bodyParser())
    .use(miSend())
    .use(miLog())
}