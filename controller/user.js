const bcrypt = require('bcryptjs')
const secret = require('../config/secret.json')
const {query} = require('../config/db')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
module.exports = {
  register: async (ctx, next) => {
    let {username, password} = ctx.request.body
    let notHave =await query(`SELECT * FROM user where username='${username}'`)
    if( notHave.length <= 0){
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)
      password = hash

      await query(`INSERT INTO user (username, password, livecode) VALUES ('${username}', '${password}','${username}')`)
      await query(`INSERT INTO live (roomname, gift, peonum, livecode, usecustom, active) VALUES ('${username}',0,0,'${username}',0,0)`)
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
        /**
         * jwt生成
         */
        let userToken = {
          username: username
        }
        const token = jwt.sign(userToken, secret.sign, {expiresIn:'1h'})
        ctx.send({
          code:'1',
          message:'登录成功',
          token:'Bearer '+token
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
  },
  getUserinfo: async (ctx, next) => {
    const token = ctx.request.header.authorization
    if(token){
      let payload = await verify(token.split(' ')[1], secret.sign)
      let username = payload.username
      let result = await query(`SELECT * FROM user WHERE username='${username}'`)
      if(result.length>0){
        ctx.send({
          code:'1',
          message:result[0]
        })
      }
    } else {
      ctx.send({
        code:'-1',
        message:'认证错误'
      })
    }
  },
  delUserinfo: async (ctx, next) => {
    const token = ctx.request.header.authorization
    if(token){
      let payload = await verify(token.split(' ')[1], secret.sign)
      let username = payload.username
      let result = await query(`SELECT id,livecode FROM user WHERE username='${username}'`)
      if(result.length>0){
        // 判断不要用户删除自己
        if(result[0]['id'] !== parseInt(ctx.params.id)){
          let del = await query(`DELETE FROM user WHERE id=${ctx.params.id}`)
          if(del.affectedRows===1){
            // 同时删除直播间
            await query(`DELETE FROM live WHERE livecode='${result[0]["livecode"]}'`)
            ctx.send({
              code:'1',
              message: '删除成功'
            })
          }
        } else{
          ctx.send({
            code:'-1',
            message:'大哥请不要删除自己，谢谢合作！'
          })
        }
      } else {
        ctx.send({
          code:'-1',
          message:'无法删除'
        })
      }
    } else {
      ctx.send({
        code:'-1',
        message:'认证错误'
      })
    }
  },
  putUserInfo: async(ctx, next) => {
    let {username, email} = ctx.request.body
    const token = ctx.request.header.authorization
    if(token) {
      let playload = await verify(token.split(' ')[1], secret.sign)
      let realusername = playload.username
      query(`UPDATE user SET username='${username}',email='${email}' where username='${realusername}'`)
      ctx.send({
        code:'1',
        message:'修改成功'
      })
    } else {
      ctx.send({
        code:'-1',
        message: '认证失败'
      })
    }
  }
}