const axios = require('axios')
const fs = require("fs")
const PATH = require("path")

class HttpAuth {
  constructor(opt) {
    this.url = opt.url
    this.path = opt.path
    this.query = opt.query || ['access_token', 'access_token']
    this.clientIdField = opt.clientIdField || 'id'
  }
  check(req, res) {
    const { query } = require('url').parse(req.url, true)
    return new Promise((resolve, reject) => {
      let param = [this.query[0], query[this.query[1]]]
      param = param.join('=')
      axios.get(`${this.url}?${param}`).then(rsp => {
        if (rsp.data.code !== 0) {
          return reject(rsp.data)
        }
        const client = rsp.data.result
        const clientId = client[this.clientIdField]
        resolve(clientId)
      })
    })
  }
}

module.exports = (function() {
  let instance
  return function(opt) {
    if (instance) return instance

    if (typeof opt.http === 'object') instance = new HttpAuth(opt.http)

    return instance
  }
})()
