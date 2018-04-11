const bcrypt = require('bcryptjs')
const secret = require('../config/secret.json')
const {query} = require('../config/db')
module.exports = {
  register: async (ctx, next) => {
    let {username, password} = ctx.request.body
    let notHave =await query(`SELECT * FROM user where username='${username}'`)
    if( notHave.length <= 0){
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)
      password = hash

      await query(`INSERT INTO user (username, password, livecode) VALUES ('${username}', '${password}','${username}')`)
      ctx.send({
        code:'1',
        message:'注册成功'
      })
    } else {
      ctx.send({
        code:'-1',
        message:'用户名重复，请重新输入！'
      })
    }
  },
  login: async (ctx, next) => {
    let {username, password} = ctx.request.body
    let result = await query(`SELECT password  FROM user where username='${username}'`)
    if(result.length>0) {
      let realPwd = result[0]['password']
      if(bcrypt.compareSync(password,realPwd)){
        ctx.send({
          code:'1',
          message:'登录成功',
          token:new Buffer(username).toString('base64')
        })
      } else {
        ctx.send({
          code:'-1',
          message:'密码错误',
        })
      }
    } else {
      ctx.send({
        code:'-1',
        message:'用户不存在',
      })
    }
  }
}