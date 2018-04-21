const bcrypt = require('bcryptjs')
const secret = require('../config/secret.json')
const {query} = require('../config/db')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
module.exports = {
  register: async (ctx, next) => {
    let {username, password} = ctx.request.body
    let notHave =await query(`SELECT * FROM user where username='${username}'`) // 判断是否有重复的用户
    if( notHave.length <= 0){//如果没有
      const salt = bcrypt.genSaltSync() 
      const hash = bcrypt.hashSync(password, salt)
      password = hash //对密码进行加密

      await query(`INSERT INTO user (username, password, livecode) VALUES ('${username}', '${password}','${username}')`) // 将用户传入数据库
      await query(`INSERT INTO live (roomname, gift, peonum, livecode, usecustom, active) VALUES ('${username}',0,0,'${username}',0,0)`) // 初始化直播间
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
    let result = await query(`SELECT password  FROM user where username='${username}'`) // 查询登陆用户的密码
    if(result.length>0) { // 如果存在，则确定用户存在
      let realPwd = result[0]['password'] //将查询到的密码放入变量
      if(bcrypt.compareSync(password,realPwd)){//比对传入的代码和查询到的代码
        /**
         * jwt生成
         */
        let userToken = {
          username: username
        }
        const token = jwt.sign(userToken, secret.sign, {expiresIn:'1h'}) // 如果正确 则生成jwt token，用于用户检测
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
      let payload = await verify(token.split(' ')[1], secret.sign) // 解密jwt token
      let username = payload.username // 从解密后的信息中获取username
      let result = await query(`SELECT * FROM user WHERE username='${username}'`) // 查询用户的所有信息
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
      let result = await query(`SELECT id FROM user WHERE username='${username}'`)
      if(result.length>0){
        // 判断不要用户删除自己
        if(result[0]['id'] !== parseInt(ctx.params.id)){
          // 先删直播间
          await query(`DELETE FROM live WHERE livecode=(SELECT livecode FROM user WHERE id=${parseInt(ctx.params.id)})`)
          // 再删人
          let del = await query(`DELETE FROM user WHERE id=${ctx.params.id}`)
          if(del.affectedRows>0){
            ctx.send({
              code:'1',
              message: '删除成功'
            })
          } else {
            ctx.send({
              code:'-1',
              message:'无法删除'
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
