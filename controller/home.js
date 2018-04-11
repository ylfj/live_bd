const HomeService = require('../service/home')
module.exports = {
  index: async (ctx, next) => {
    ctx.send({
      status:'success',
      data:'hello klren'
    })
  },
  home: async (ctx, next) => {
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
    ctx.body = '<h1>Home page</h1>'
  },
  homeParams: async (ctx, next) => {
    console.log(ctx.params)
    ctx.body = '<h1>Home page /:id/:name</h1>'
  },
  register: async(ctx, next) =>{
    console.log(ctx.request.body)
    let {
      name,
      password
    } = ctx.request.body
    let data = await HomeService.register(name,password)
    ctx.body = data
  },
  login: async (ctx, next) => {
    await ctx.render('home/login', {
      btnName: 'GoGoGo'
    })
  },
  test: async (ctx, next) => {
    console.log(ctx.request.body)
  }
}