const router = require('koa-router')()
const UserController = require('./controller/user')
module.exports = (app) => {
  router.post('/register', UserController.register)
  router.post('/login', UserController.login)
  router.get('/userinfo', UserController.userinfo)
  app.use(router.routes())
    .use(router.allowedMethods())
}