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
      let result = await query(`select active from live where livecode = (select livecode from user where username='${username}')`)
      if(result.length>0){
        ctx.send({
          code:1,
          message: result[0]
        })
      }
      
    } else {
      ctx.send({
        code:'-1',
        message:'认证错误'
      })
    }
  },
  getAllLive: async(ctx,next) => {
    let result = await query(`SELECT * FROM live`)
    if(result.length>0){
      ctx.send({
        code:1,
        message:result
      })
    } else {
      ctx.send({
        code:'-1',
        message:'无数据'
      })
    }
  },
  updateLiveInfo: async(ctx,next) => {
    let {roomname,liveurl,usecustom} = ctx.request.body
    const token = ctx.request.header.authorization
    if(token) {
      let payload = await verify(token.split(' ')[1], secret.sign)
      let username = payload.username
      let result = await query(`UPDATE live SET roomname='${roomname}',liveurl='${liveurl}',usecustom='${usecustom}' 
        WHERE livecode=(SELECT livecode FROM user where username='${username}')`)
      if(result.affectedRows=='1'){
        ctx.send({
          code:'1',
          message: "更改成功"
        })
      } else {
        ctx.send({
          code:'-1',
          message:"更改失败"
        })
      }
    }
  },
  addGift: async (ctx,next) => {
    let livecode = ctx.params.livecode
    let result = await query(`UPDATE live SET gift=gift+1 WHERE livecode='${livecode}'`)
    if(result.affectedRows=='1'){
      ctx.send({
        code:'1',
        message: "礼品赠送成功"
      })
    } else {
      ctx.send({
        code:'-1',
        message:"礼品赠送失败"
      })
    }
  }

}