const mysql = require('mysql')
const pool = mysql.createPool({
  host: '119.28.84.27',
  user: 'root',
  password: 'klren0312',
  database: 'zb'
})

let query = ( sql, values ) => {
  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = {query}