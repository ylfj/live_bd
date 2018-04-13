const secret = require('../config/secret.json')
const {query} = require('../config/db')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)

module.exports = {
  activeLive: async (ctx, next) => {
    const token = ctx.request.header.authorization
    if(token) {
      let payload = await verify(token.split(' ')[1], secret.sign)
      let username = payload.username
      let result = await query(`SELECT livecode FROM user WHERE username='${username}'`)
      if(result.length>0){
        let active = await query(`UPDATE live SET active=1`)
        if(active.affectedRows>0){
          ctx.send({
            code: '1',
            message:'激活成功'
          })
        } else {
          ctx.send({
            code:'-1',
            message:'激活失败，请联系天神'
          })
        }
      } else {
        ctx.send({
          code:'-1',
          message:'认证错误'
        })
      }
    }
  },
  ifActiveLive: async (ctx, next) => {
    const token = ctx.request.header.authorization
    if(token) {
      let payload = await verify(token.split(' ')[1], secret.sign)
      let username = payload.username
      let result = await query(`select active from user where livecode = (select livecode from user where username='${username}')`)
    } else {
      ctx.send({
        code:'-1',
        message:'认证错误'
      })
    }
  }
}