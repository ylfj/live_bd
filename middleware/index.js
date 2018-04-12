const path = require('path')
const bodyParser = require('koa-bodyparser')
const staticFiles = require('koa-static')
//jwt相关
const jwtKoa = require('koa-jwt')
const secret = require('../config/secret.json')

const miSend = require('./mi-send')
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