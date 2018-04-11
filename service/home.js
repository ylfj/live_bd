module.exports = {
  register: async (name, pwd) => {
    console.log(name)
    let data
    if (name == 'klren' && pwd =='123456') {
      data = `Hello, ${name}`
    } else {
      data = '账号信息错误'
    }
    return data
  },
}