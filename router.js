const router = require('koa-router')()
const UserController = require('./controller/user')
module.exports = (app) => {
  router.post('/login', UserController.login)            // 登录
  router.post('/register', UserController.register)      // 注册
  router.get('/userinfo', UserController.getUserinfo)    // 获取用户信息
  router.del('/userinfo/:id',UserController.delUserinfo) // 删除用户
  router.put('/userinfo', UserController.putUserInfo)    // 更新用户信息
  app.use(router.routes())
    .use(router.allowedMethods())
}