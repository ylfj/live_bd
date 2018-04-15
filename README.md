# 治娱直播 后端

## 采用技术

 - koa2
 - mysql
 - restful
 - jwt

## 目录
```
.
├── README.md         
├── package.json        // npm 配置
├── app.js              // 项目主文件
├── router.js           // 路由配置文件
├── controller          // 控制器，路由详细配置
├── logs                // 日志
├── middleware          // 中间件
└── public              // 静态文件
```

## 运行方式
```
$ npm install -g nodemon
$ nodemon app.js 
```

## 部署方式
```
$ npm install -g pm2
$ pm2 start app.js
```

## ChangeLog

 - 2018/4/10 基本框架
 - 2018/4/11 登录注册
 - 2018/4/12 jwt支持,用户删除，用户修改，用户查询
 - 2018/4/13 注册用户自动创建直播间，删除用户自动删除直播间，激活直播间
 - 2018/4/15 更新直播间信息，赠送礼物，获取所有直播间信息

## 参考资料

 - koa2 的ctx参数文档：https://github.com/koajs/koa/blob/master/docs/api/context.md
 - koa2 的 todolist项目：https://github.com/yin-fan/todoList
 - koa2 使用jwt ：https://www.jianshu.com/p/176198fbdb35