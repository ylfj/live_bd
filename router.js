const router = require('koa-router')()
const UserController = require('./controller/user')
const LiveController = require('./controller/live')
module.exports = (app) => {
  // 用户相关
  router.post('/login', UserController.login)            // 登录
  router.post('/register', UserController.register)      // 注册
  router.get('/userinfo', UserController.getUserinfo)    // 获取用户信息
  router.del('/userinfo/:id',UserController.delUserinfo) // 删除用户
  router.put('/userinfo', UserController.putUserInfo)    // 更新用户信息
  // 直播间相关
  router.put('/activelive', LiveController.activeLive)   // 激活直播间
  router.get('/activelive', LiveController.ifActiveLive) // 获取激活状态
  app.use(router.routes())
    .use(router.allowedMethods())
}