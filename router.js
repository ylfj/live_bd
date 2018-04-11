const router = require('koa-router')()
const HomeController = require('./controller/home')
const UserController = require('./controller/user')
module.exports = (app) => {
  router.get('/', HomeController.index)

  
  router.post('/register', UserController.register)
  router.post('/login', UserController.login)
  app.use(router.routes())
    .use(router.allowedMethods())
}